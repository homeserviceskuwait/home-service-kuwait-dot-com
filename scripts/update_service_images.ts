
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY; // Prefer service role if available for storage policies

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const ARTIFACTS_DIR = 'C:/Users/almamun/.gemini/antigravity/brain/71b65e19-05b9-45cc-86f7-7a3e21ea749f';

const SERVICE_IMAGES = [
    { id: 'pbx', imageName: 'pbx_system' },
    { id: 'cctv', imageName: 'cctv_camera' },
    { id: 'intercom', imageName: 'intercom_system' },
    { id: 'fingerprint', imageName: 'fingerprint_attendance' },
    { id: 'audio', imageName: 'audio_system' },
    { id: 'smart-lock', imageName: 'smart_door_lock' },
    { id: 'internet', imageName: 'internet_service' },
    { id: 'landline', imageName: 'landline_repair' }
];

async function findImageFile(imageName: string): Promise<string | null> {
    try {
        const files = fs.readdirSync(ARTIFACTS_DIR);
        // Find file starting with imageName and ending with .png
        const file = files.find(f => f.startsWith(imageName) && f.endsWith('.png'));
        return file ? path.join(ARTIFACTS_DIR, file) : null;
    } catch (error) {
        console.error(`Error reading artifacts dir: ${error}`);
        return null;
    }
}

async function uploadImage(serviceId: string, imagePath: string) {
    try {
        const fileContent = fs.readFileSync(imagePath);
        const fileName = `${serviceId}_${Date.now()}.png`;

        console.log(`Uploading ${fileName} for service ${serviceId}...`);

        const { data, error } = await supabase.storage
            .from('service-images')
            .upload(fileName, fileContent, {
                contentType: 'image/png',
                upsert: true
            });

        if (error) {
            throw error;
        }

        const { data: { publicUrl } } = supabase.storage
            .from('service-images')
            .getPublicUrl(fileName);

        console.log(`Uploaded. Public URL: ${publicUrl}`);

        // Update service record
        // We need to find the service by its 'id' field which matches our static IDs in constants.ts
        // BUT wait, the database IDs are UUIDs, not 'pbx', 'cctv' etc.
        // The 'id' in constants.ts is just for the static list.
        // We need to query the service by title or some other unique field, OR update based on the UUIDs we found earlier.
        // Let's try to match by title (English) since that's reliable.

        let titleKeyword = '';
        switch (serviceId) {
            case 'pbx': titleKeyword = 'Telephone Exchange'; break;
            case 'cctv': titleKeyword = 'CCTV'; break;
            case 'intercom': titleKeyword = 'Intercom'; break;
            case 'fingerprint': titleKeyword = 'Fingerprint'; break;
            case 'audio': titleKeyword = 'Audio'; break;
            case 'smart-lock': titleKeyword = 'Smart Door'; break;
            case 'internet': titleKeyword = 'Internet'; break;
            case 'landline': titleKeyword = 'Landline'; break;
        }

        if (!titleKeyword) {
            console.error(`No keyword for ${serviceId}`);
            return;
        }

        // Find service by title
        const { data: services, error: searchError } = await supabase
            .from('services')
            .select('id, title_en')
            .ilike('title_en', `%${titleKeyword}%`);

        if (searchError || !services || services.length === 0) {
            console.error(`Service not found for keyword: ${titleKeyword}`);
            return;
        }

        const dbServiceId = services[0].id;
        console.log(`Found service: ${services[0].title_en} (${dbServiceId})`);

        const { error: updateError } = await supabase
            .from('services')
            .update({ image_url: publicUrl })
            .eq('id', dbServiceId);

        if (updateError) {
            throw updateError;
        }

        console.log(`Updated service ${dbServiceId} with new image.`);

    } catch (error) {
        console.error(`Error processing ${serviceId}:`, error);
    }
}

async function main() {
    for (const item of SERVICE_IMAGES) {
        const imagePath = await findImageFile(item.imageName);
        if (imagePath) {
            await uploadImage(item.id, imagePath);
        } else {
            console.log(`Image not found for ${item.id} (${item.imageName})`);
        }
    }
}

main();
