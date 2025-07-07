// app/head.tsx

export default function Head() {
  return (
    <>
      <title>Beta7</title>
      <meta name="description" content="AI video creation from still images" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Dropbox Chooser SDK */}
      <script
        id="dropbox-chooser"
        src="https://www.dropbox.com/static/api/2/dropins.js"
        data-app-key={process.env.NEXT_PUBLIC_DROPBOX_APP_KEY}
      />
    </>
  );
}
