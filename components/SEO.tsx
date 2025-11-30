import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: string;
    lang?: 'en' | 'ar';
}

const SEO: React.FC<SEOProps> = ({
    title,
    description,
    keywords,
    image,
    url,
    type = 'website',
    lang = 'en'
}) => {
    const siteUrl = 'https://homeservicekuwait.com'; // Replace with actual domain
    const fullUrl = url ? (url.startsWith('http') ? url : `${siteUrl}${url}`) : siteUrl;
    const fullImage = image ? (image.startsWith('http') ? image : `${siteUrl}${image}`) : `${siteUrl}/og-image.jpg`;

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{title}</title>
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}
            <link rel="canonical" href={fullUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={fullImage} />
            <meta property="og:locale" content={lang === 'ar' ? 'ar_KW' : 'en_US'} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={fullUrl} />
            <meta property="twitter:title" content={title} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={fullImage} />
        </Helmet>
    );
};

export default SEO;
