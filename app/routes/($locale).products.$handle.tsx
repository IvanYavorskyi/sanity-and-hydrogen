// app/routes/products.$handle.tsx
import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {PortableText} from '@portabletext/react';
import groq from 'groq';
import type {Product} from '@shopify/hydrogen/storefront-api-types';
import type {SanityDocument} from '@sanity/client';
import {useLoaderData, Link, type MetaFunction} from 'react-router';

export async function loader({
  params,
  context: {storefront, sanityClient},
}: LoaderFunctionArgs) {
  try {
    // 1️⃣ Fetch the Shopify product
    const {product} = await storefront.query<{product: Product}>(
      `
      query Product($handle: String!) {
        product(handle: $handle) {
          id
          title
          handle
        }
      }
    `,
      {variables: {handle: params.handle}},
    );

    if (!product?.id) {
      // Product not found → 404
      return new Response(JSON.stringify({error: 'Product not found'}), {
        status: 404,
        headers: {'Content-Type': 'application/json'},
      });
    }

    // 2️⃣ Fetch the Sanity document
    const query = groq`*[_type=="product" && store.slug.current == $handle][0]{
      body,
      "image": store.previewImageUrl
    }`;
    const sanityData = await sanityClient.fetch<SanityDocument>(query, {
      handle: params.handle,
    });

    // 3️⃣ Return a JSON response with both
    return new Response(JSON.stringify({product, sanityData}), {
      status: 200,
      headers: {'Content-Type': 'application/json'},
    });
  } catch (err: any) {
    console.error('Loader error:', err);
    // 500 with JSON body
    return new Response(
      JSON.stringify({error: err.message || 'Internal Server Error'}),
      {status: 500, headers: {'Content-Type': 'application/json'}},
    );
  }
}

export default function Page() {
  // Since loader always returns a JSON object, parse it here
  const data = useLoaderData<{
    product?: Product;
    sanityData?: SanityDocument;
    error?: string;
  }>();

  console.log({data});

  if (data.error) {
    return <p className="text-red-500">Error: {data.error}</p>;
  }
  const {product, sanityData} = data!;

  return (
    <div className="mx-auto p-12 prose prose-a:text-blue-500">
      <h1 className="text-3xl font-bold">{product!.title}</h1>

      {sanityData?.image && (
        <img
          src={sanityData.image}
          alt={product!.title}
          className="w-32 h-32 object-cover float-left mr-6 mb-4 rounded-xl"
        />
      )}

      {sanityData?.body && <PortableText value={sanityData.body} />}

      <p>
        <Link to="/products">&larr; Back to All Products</Link>
      </p>
    </div>
  );
}
