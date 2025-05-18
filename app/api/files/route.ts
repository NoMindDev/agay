import { link } from "fs";
import { google } from "googleapis";
import { NextResponse } from "next/server";

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  redirectUri: REDIRECT_URI,
});

const folderId = process.env.FOLDER_ID;
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
const drive = google.drive({
  version: "v3",
  auth: oauth2Client,
});

export async function GET(request: Request) {
  try {
    console.log("request is reaching ", folderId);
    const rest = await drive.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      fields: "files(id,name,mimeType)",
      pageSize: 1000,
    });
    let links: any[] = [];
    const files = rest.data.files;
    if (files?.length) {
      files.forEach(async (file) => {
        if (file.id) {
          const res = drive.permissions.create({
            fileId: file.id,
            requestBody: {
              role: "reader",
              type: "anyone",
            },
          });
        }
        const obj = {
          name: file.name,
          link: `https://drive.google.com/file/d/${file.id}/view`,
        };
        links.push(obj);
      });
    } else {
      console.log("No files found");
    }
    console.log(links, " links");
    return NextResponse.json(links);
  } catch (err) {
    console.log(err, "error in getting files");
  }
}
