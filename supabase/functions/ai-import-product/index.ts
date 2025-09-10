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
          error: 'Could not extract data from this URL',
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
        error: error.message,
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
  try {
    // Try to extract JSON-LD structured data first
    const jsonLdMatch = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gis);
    let structuredData = null;
    
    if (jsonLdMatch) {
      for (const match of jsonLdMatch) {
        try {
          const jsonContent = match.replace(/<script[^>]*>/, '').replace(/<\/script>/, '');
          const data = JSON.parse(jsonContent);
          if (data['@type'] === 'Product' || (Array.isArray(data) && data.some(item => item['@type'] === 'Product'))) {
            structuredData = Array.isArray(data) ? data.find(item => item['@type'] === 'Product') : data;
            break;
          }
        } catch (e) {
          console.log('Failed to parse JSON-LD:', e);
        }
      }
    }

    // Extract title
    let title = '';
    if (structuredData?.name) {
      title = structuredData.name;
    } else {
      const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
      if (titleMatch) {
        title = titleMatch[1].replace(/&[^;]+;/g, '').trim();
      }
    }

    // Extract price
    let price = 0;
    let currency = 'DZD';
    if (structuredData?.offers) {
      const offer = Array.isArray(structuredData.offers) ? structuredData.offers[0] : structuredData.offers;
      if (offer.price) {
        price = parseFloat(offer.price);
        currency = offer.priceCurrency || 'DZD';
      }
    } else {
      // Try to find price in meta tags or common price selectors
      const pricePatterns = [
        // Patterns spécifiques à l'Algérie (DA, DZD, dinars)
        /(\d{1,3}(?:[,\s]\d{3})*(?:\.\d{2})?)\s*(?:DA|DZD|د\.ج)/gi,
        /(\d{1,3}(?:[,\s]\d{3})*(?:\.\d{2})?)\s*dinars?/gi,
        
        // Patterns JSON et meta
        /"price":\s*"?(\d{1,3}(?:[,\s]\d{3})*(?:\.\d{2})?)"?/gi,
        /"amount":\s*"?(\d{1,3}(?:[,\s]\d{3})*(?:\.\d{2})?)"?/gi,
        
        // Patterns CSS classes communes pour l'e-commerce
        /class="[^"]*price[^"]*"[^>]*>\s*[^0-9]*(\d{1,3}(?:[,\s]\d{3})*(?:\.\d{2})?)/gi,
        /prix[^>]*>\s*[^0-9]*(\d{1,3}(?:[,\s]\d{3})*(?:\.\d{2})?)/gi,
        /montant[^>]*>\s*[^0-9]*(\d{1,3}(?:[,\s]\d{3})*(?:\.\d{2})?)/gi,
        
        // Patterns spécifiques aux sites algériens
        /jumia\.com\.dz.*?(\d{1,3}(?:[,\s]\d{3})*(?:\.\d{2})?)\s*DA/gi,
        /ouedkniss\.com.*?(\d{1,3}(?:[,\s]\d{3})*(?:\.\d{2})?)\s*DA/gi,
        
        // Patterns génériques avec plus de contexte
        /(\d{1,6}(?:[,\s]\d{3})*)\s*(?:DA|DZD|د\.ج|dinars?)/gi
      ];
      
      let maxPrice = 0;
      for (const pattern of pricePatterns) {
        const matches = Array.from(html.matchAll(pattern));
        if (matches.length > 0) {
          for (const match of matches) {
            const priceStr = match[1];
            if (priceStr) {
              // Nettoyer et convertir le prix
              const cleanPrice = priceStr.replace(/[,\s]/g, '');
              const extractedPrice = parseFloat(cleanPrice);
              
              // Prendre le prix le plus élevé trouvé (souvent le prix réel vs prix barré)
              if (extractedPrice > maxPrice && extractedPrice > 10) {
                maxPrice = extractedPrice;
              }
            }
          }
        }
      }
      
      if (maxPrice > 0) {
        price = maxPrice;
        console.log(`Prix extrait: ${price} DA`);
      }
    }

    // Extract description
    let description = '';
    if (structuredData?.description) {
      description = structuredData.description;
    } else {
      const metaDesc = html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i);
      if (metaDesc) {
        description = metaDesc[1];
      } else {
        // Try to find product description in common containers
        const descPatterns = [
          /<div[^>]*class="[^"]*description[^"]*"[^>]*>(.*?)<\/div>/gis,
          /<p[^>]*class="[^"]*description[^"]*"[^>]*>(.*?)<\/p>/gis
        ];
        
        for (const pattern of descPatterns) {
          const match = html.match(pattern);
          if (match) {
            description = match[1].replace(/<[^>]*>/g, '').trim();
            break;
          }
        }
      }
    }

    // Extract images
    const images: Array<{url: string, alt?: string}> = [];
    
    if (structuredData?.image) {
      const imageUrls = Array.isArray(structuredData.image) ? structuredData.image : [structuredData.image];
      for (const img of imageUrls) {
        const url = typeof img === 'string' ? img : img.url || img['@id'];
        if (url) {
          images.push({
            url: resolveUrl(url, baseUrl),
            alt: typeof img === 'object' ? img.name || img.caption : undefined
          });
        }
      }
    } else {
      // Extract images from img tags
      const imgMatches = html.match(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/gi);
      if (imgMatches) {
        for (const match of imgMatches.slice(0, 5)) { // Limit to 5 images
          const srcMatch = match.match(/src="([^"]*)"/);
          const altMatch = match.match(/alt="([^"]*)"/);
          if (srcMatch) {
            const imageUrl = resolveUrl(srcMatch[1], baseUrl);
            if (imageUrl.includes('product') || imageUrl.includes('img') || 
                !imageUrl.includes('logo') && !imageUrl.includes('icon')) {
              images.push({
                url: imageUrl,
                alt: altMatch ? altMatch[1] : undefined
              });
            }
          }
        }
      }
    }

    // Extract reviews
    const reviews: Array<{rating: number, comment: string, author?: string}> = [];
    if (structuredData?.review || structuredData?.aggregateRating) {
      // Try to extract reviews from structured data
      const reviewsData = structuredData.review;
      if (Array.isArray(reviewsData)) {
        for (const review of reviewsData.slice(0, 5)) {
          if (review.reviewRating && review.reviewBody) {
            reviews.push({
              rating: parseFloat(review.reviewRating.ratingValue || review.reviewRating),
              comment: review.reviewBody,
              author: review.author?.name || review.author
            });
          }
        }
      }
    }

    // Generate some basic tags from title and description
    const tags = generateTags(title, description);

    if (!title && !price && !description) {
      return null;
    }

    return {
      title: title || 'Produit importé',
      price: price,
      currency: currency,
      description: description || 'Description à compléter',
      images,
      tags,
      reviews: reviews.length > 0 ? reviews : undefined
    };

  } catch (error) {
    console.error('Error extracting product data:', error);
    return null;
  }
}

function resolveUrl(url: string, baseUrl: string): string {
  try {
    if (url.startsWith('http')) {
      return url;
    }
    const base = new URL(baseUrl);
    return new URL(url, base).href;
  } catch {
    return url;
  }
}

function generateTags(title: string, description: string): string[] {
  const text = (title + ' ' + description).toLowerCase();
  const commonTags = [
    'électronique', 'mode', 'beauté', 'maison', 'sport', 'cuisine', 'high-tech',
    'smartphone', 'ordinateur', 'accessoire', 'vêtement', 'chaussure', 'sac',
    'cosmétique', 'parfum', 'skincare', 'décoration', 'meuble', 'jardin'
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
        'Produit de qualité',
        'Livraison rapide',
        'Service client réactif'
      ]
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
        max_tokens: 1000,
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