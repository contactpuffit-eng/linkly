import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ExtractedData {
  title: string;
  price: number;
  currency: string;
  description: string;
  images: Array<{
    url: string;
    alt?: string;
  }>;
  variants?: Array<{
    name: string;
    sku: string;
    price: number;
    stock?: number;
  }>;
  tags: string[];
  reviews?: Array<{
    rating: number;
    comment: string;
    author?: string;
  }>;
}

interface AIGeneratedContent {
  seo_title: string;
  seo_description: string;
  bullet_benefits: string[];
  category_suggestion?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    
    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Starting AI import for URL:', url);

    // Step 1: Scrape the webpage
    const scrapedData = await scrapeWebpage(url);
    console.log('Scraped data:', scrapedData);

    if (!scrapedData) {
      return new Response(
        JSON.stringify({ 
          error: 'Could not extract data from this URL. Please verify the URL and try again.',
          success: false 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Step 2: Use AI to analyze and enhance the data
    const aiEnhancedData = await enhanceWithAI(scrapedData);
    console.log('AI enhanced data:', aiEnhancedData);

    const result = {
      success: true,
      source_url: url,
      extracted: scrapedData,
      ai_generated: aiEnhancedData
    };

    return new Response(
      JSON.stringify(result),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in ai-import-product:', error);
    return new Response(
      JSON.stringify({ 
        error: `Import failed: ${error.message}`,
        success: false 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function scrapeWebpage(url: string): Promise<ExtractedData | null> {
  try {
    console.log('Fetching webpage:', url);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    console.log('HTML length:', html.length);

    // Extract structured data using various strategies
    const extractedData = extractProductData(html, url);
    
    return extractedData;
  } catch (error) {
    console.error('Error scraping webpage:', error);
    return null;
  }
}

function extractProductData(html: string, baseUrl: string): ExtractedData | null {
  console.log('Extracting product data from HTML');
  
  try {
    // Extract title - Multiple methods
    let title = '';
    
    // Method 1: Try JSON-LD structured data
    const jsonLdMatch = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gis);
    if (jsonLdMatch) {
      for (const match of jsonLdMatch) {
        try {
          const jsonContent = match.replace(/<script[^>]*>/, '').replace(/<\/script>/, '');
          const data = JSON.parse(jsonContent);
          if (data['@type'] === 'Product' || (Array.isArray(data) && data.some((item: any) => item['@type'] === 'Product'))) {
            const product = Array.isArray(data) ? data.find((item: any) => item['@type'] === 'Product') : data;
            if (product?.name) {
              title = product.name;
              break;
            }
          }
        } catch (e) {
          // Continue to next JSON-LD block
        }
      }
    }
    
    // Method 2: Try meta og:title
    if (!title) {
      const ogTitleMatch = html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]*)"[^>]*>/i);
      if (ogTitleMatch) {
        title = ogTitleMatch[1];
      }
    }
    
    // Method 3: Try page title
    if (!title) {
      const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
      if (titleMatch) {
        title = titleMatch[1].replace(/&[^;]+;/g, '').trim();
      }
    }
    
    // Method 4: Try h1 tags
    if (!title) {
      const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
      if (h1Match) {
        title = h1Match[1].replace(/<[^>]*>/g, '').trim();
      }
    }

    console.log('Extracted title:', title);

    // Extract price - Enhanced for Algerian sites
    let price = 0;
    const pricePatterns = [
      // Patterns spécifiques à l'Algérie
      /(\d{1,6}(?:[,\s]\d{3})*(?:\.\d{2})?)\s*(?:DA|DZD|د\.ج)/gi,
      /(\d{1,6}(?:[,\s]\d{3})*(?:\.\d{2})?)\s*dinars?/gi,
      
      // Patterns JSON et structured data
      /"price":\s*"?(\d{1,6}(?:[,\s]\d{3})*(?:\.\d{2})?)"?/gi,
      /"amount":\s*"?(\d{1,6}(?:[,\s]\d{3})*(?:\.\d{2})?)"?/gi,
      
      // Patterns meta tags
      /content="[^"]*(\d{1,6}(?:[,\s]\d{3})*(?:\.\d{2})?)[^"]*DA"/gi,
      
      // Patterns génériques avec devises algériennes
      /prix[^>]*>\s*[^0-9]*(\d{1,6}(?:[,\s]\d{3})*(?:\.\d{2})?)/gi
    ];
    
    let maxPrice = 0;
    for (const pattern of pricePatterns) {
      const matches = Array.from(html.matchAll(pattern));
      for (const match of matches) {
        const priceStr = match[1];
        if (priceStr) {
          const cleanPrice = priceStr.replace(/[,\s]/g, '');
          const extractedPrice = parseFloat(cleanPrice);
          
          if (extractedPrice > maxPrice && extractedPrice > 10 && extractedPrice < 10000000) {
            maxPrice = extractedPrice;
          }
        }
      }
    }
    
    if (maxPrice > 0) {
      price = maxPrice;
      console.log(`Prix extrait: ${price} DA`);
    }

    // Extract description
    let description = '';
    
    // Method 1: Try meta description
    const metaDescMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i);
    if (metaDescMatch) {
      description = metaDescMatch[1];
    }
    
    // Method 2: Try og:description
    if (!description) {
      const ogDescMatch = html.match(/<meta[^>]*property="og:description"[^>]*content="([^"]*)"[^>]*>/i);
      if (ogDescMatch) {
        description = ogDescMatch[1];
      }
    }

    console.log('Extracted description length:', description.length);

    // Enhanced image extraction using regex only
    const images: Array<{url: string, alt?: string}> = [];
    
    // Pattern pour extraire toutes les balises img
    const imgPattern = /<img[^>]*>/gi;
    const imgMatches = html.match(imgPattern);
    
    if (imgMatches) {
      console.log(`Found ${imgMatches.length} img tags`);
      
      for (const imgTag of imgMatches) {
        // Extraire l'URL src
        const srcMatch = imgTag.match(/src="([^"]*)"/i);
        const dataSrcMatch = imgTag.match(/data-src="([^"]*)"/i);
        const dataOriginalMatch = imgTag.match(/data-original="([^"]*)"/i);
        
        // Extraire l'alt text
        const altMatch = imgTag.match(/alt="([^"]*)"/i);
        
        const src = srcMatch?.[1] || dataSrcMatch?.[1] || dataOriginalMatch?.[1];
        const alt = altMatch?.[1] || 'Product image';
        
        if (src) {
          let imageUrl = src;
          
          // Résoudre les URLs relatives
          if (!src.startsWith('http')) {
            try {
              const base = new URL(baseUrl);
              imageUrl = new URL(src, base).href;
            } catch {
              continue;
            }
          }
          
          // Filtrer les images pertinentes
          const isRelevant = (
            // Contient "product" dans l'URL ou l'alt
            (imageUrl.toLowerCase().includes('product') || alt.toLowerCase().includes('product')) ||
            // Spécifique à Jumia
            imageUrl.includes('unsafe/fit-in') ||
            // URLs contenant des mots-clés d'images produit
            imageUrl.includes('/img/') || 
            imageUrl.includes('/images/') ||
            imageUrl.includes('media')
          );
          
          const isNotIcon = (
            !imageUrl.includes('logo') &&
            !imageUrl.includes('icon') &&
            !imageUrl.includes('sprite') &&
            !imageUrl.includes('.gif') &&
            imageUrl.length > 30
          );
          
          if (isRelevant && isNotIcon && !images.find(existing => existing.url === imageUrl)) {
            images.push({
              url: imageUrl,
              alt: alt
            });
          }
        }
      }
    }

    console.log(`Successfully extracted ${images.length} images`);

    // Validation - nous avons besoin d'au moins un titre
    if (!title || title.length < 3) {
      console.error('Could not extract valid title');
      return null;
    }

    const result = {
      title: title.trim(),
      price: price,
      currency: 'DZD',
      description: description.trim() || 'Description à compléter',
      images: images,
      tags: generateTags(title, description),
      reviews: undefined
    };

    console.log('Final extracted data:', {
      title: result.title,
      price: result.price,
      description: result.description.substring(0, 100),
      imageCount: result.images.length
    });

    return result;

  } catch (error) {
    console.error('Error extracting product data:', error);
    return null;
  }
}

function generateTags(title: string, description: string): string[] {
  const text = (title + ' ' + description).toLowerCase();
  const commonTags = [
    'électronique', 'mode', 'beauté', 'maison', 'sport', 'cuisine', 'high-tech',
    'smartphone', 'ordinateur', 'accessoire', 'vêtement', 'chaussure', 'sac',
    'cosmétique', 'parfum', 'skincare', 'décoration', 'meuble', 'jardin',
    'tv', 'television', 'google', 'android', 'brandt'
  ];
  
  return commonTags.filter(tag => text.includes(tag)).slice(0, 5);
}

async function enhanceWithAI(extractedData: ExtractedData): Promise<AIGeneratedContent> {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!openAIApiKey) {
    console.log('No OpenAI API key, returning basic AI content');
    return {
      seo_title: `${extractedData.title} - Achat en Ligne (Algérie)`,
      seo_description: `${extractedData.description.slice(0, 120)}... Livraison rapide en Algérie.`,
      bullet_benefits: [
        'Produit de qualité premium',
        'Livraison rapide en Algérie',
        'Garantie satisfaction client'
      ],
      category_suggestion: 'Produits e-commerce'
    };
  }

  try {
    const prompt = `
Analyse ce produit et génère du contenu marketing optimisé en français pour l'Algérie :

Titre: ${extractedData.title}
Description: ${extractedData.description}
Prix: ${extractedData.price} ${extractedData.currency}

Génère:
1. Un titre SEO optimisé (max 60 caractères) incluant "Algérie"
2. Une meta description SEO (max 160 caractères)
3. 3-5 points de vente percutants (bullet points)
4. Suggestion de catégorie principale

Réponds en JSON avec cette structure:
{
  "seo_title": "...",
  "seo_description": "...",
  "bullet_benefits": ["...", "...", "..."],
  "category_suggestion": "..."
}
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { 
            role: 'system', 
            content: 'Tu es un expert en marketing e-commerce pour le marché algérien. Réponds uniquement en JSON valide.' 
          },
          { role: 'user', content: prompt }
        ],
        max_completion_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid OpenAI response structure:', data);
      throw new Error('Invalid response from OpenAI API');
    }
    
    const aiContent = data.choices[0].message.content;
    
    try {
      return JSON.parse(aiContent);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      console.error('AI response content:', aiContent);
      throw parseError;
    }

  } catch (error) {
    console.error('Error enhancing with AI:', error);
    // Return fallback content
    return {
      seo_title: `${extractedData.title} - Achat en Ligne (Algérie)`,
      seo_description: `${extractedData.description.slice(0, 120)}... Livraison rapide en Algérie.`,
      bullet_benefits: [
        'Produit de qualité premium',
        'Livraison rapide en Algérie',
        'Garantie satisfaction client'
      ],
      category_suggestion: 'Produits e-commerce'
    };
  }
}