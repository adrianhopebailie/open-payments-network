import { default as https } from 'https'

export const CF_ZONE_ID = process.env['CF_ZONE_ID']
export const CF_API_TOKEN = process.env['CF_API_TOKEN']
export const CF_ACCOUNT_ID = process.env['CF_ACCOUNT_ID']

const hostname = 'api.cloudflare.com'

export async function validateToken(){
  const options = {
    hostname,
    port: 443,
    path: '/client/v4/user/tokens/verify',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${CF_API_TOKEN}`, 
      'Content-Type': 'application/json'
    },
  };

}

/*

curl -X GET "https://api.cloudflare.com/client/v4/user/tokens/verify" \
     -H "Authorization: Bearer LHPnoTtGbODWSeRhpxr2YgT6Oy0WtRuzw_Us-efZ" \
     -H "Content-Type:application/json"

curl -X POST "https://api.cloudflare.com/client/v4/zones/023e105f4ecef8ad9ca31a8372d0c353/purge_cache" \
     -H "Content-Type: application/json" \
     --data '{"files":["http://www.example.com/css/styles.css",{"url":"http://www.example.com/cat_picture.jpg","headers":{"Origin":"https://www.cloudflare.com","CF-IPCountry":"US","CF-Device-Type":"desktop"}}]}'

{
  "success": true,
  "errors": [],
  "messages": [],
  "result": {
    "id": "9a7806061c88ada191ed06f989cc3dac"
  }
}

*/
export async function purgeFilesFromCache(files: [string]) {

  const data = JSON.stringify({ files });
  const options = {
    hostname: 'api.cloudflare.com',
    port: 443,
    path: '/client/v4/zones/${zone}/purge_cache',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CF_API_TOKEN}`, 
      'Content-Type': 'application/json',
      'Content-Length': data.length,
    },
  };
  
  const req = https.request(options, res => {
    console.log(`statusCode: ${res.statusCode}`);
  
    res.on('data', d => {
      process.stdout.write(d);
    });
  });
  
  req.on('error', error => {
    console.error(error);
  });
  
  req.write(data);
  req.end();
  
}


