
<!-- @copyright sapthesh -->
<div align="center">
  <img src="https://storage.googleapis.com/aistudio-hosting/readme-assets/nano-banana-header.png" alt="Nano Banana AI Photo Editor Banner">
  <h1 align="center">Nano Banana AI Photo Editor 🍌✨</h1>
</div>

<div align="center">
  <!-- Dynamic Badges -->
  <a href="https://github.com/sapthesh/AI-Photo-Editor-Nano-Banana/stargazers">
    <img src="https://img.shields.io/github/stars/sapthesh/AI-Photo-Editor-Nano-Banana?style=for-the-badge&logo=github&color=b491ff&logoColor=white" alt="Stars">
  </a>
  <a href="https://github.com/sapthesh/AI-Photo-Editor-Nano-Banana/network/members">
    <img src="https://img.shields.io/github/forks/sapthesh/AI-Photo-Editor-Nano-Banana?style=for-the-badge&logo=github&color=89c4f4&logoColor=white" alt="Forks">
  </a>
  <img src="https://img.shields.io/github/repo-size/sapthesh/AI-Photo-Editor-Nano-Banana?style=for-the-badge&logo=github&color=ff69b4&logoColor=white" alt="Repo Size">
  <img src="https://img.shields.io/github/last-commit/sapthesh/AI-Photo-Editor-Nano-Banana?style=for-the-badge&logo=github&color=f4d03f&logoColor=white" alt="Last Commit">
</div>

<br>

Welcome to the **Nano Banana AI Photo Editor**! This powerful web application allows you to transform your photos with simple text prompts. Just upload an image, select a region, and describe your vision in natural language. Powered by the Google Gemini `gemini-2.5-flash-image-preview` model, it brings your creative ideas to life with stunning, context-aware edits.

<br>

<div align="center">
  <img src="https://storage.googleapis.com/aistudio-hosting/readme-assets/nano-banana-screenshot.png" alt="AI Photo Editor Screenshot" width="800">
</div>

## ✨ Features

-   🎨 **AI-Powered Editing:** Describe complex edits in plain English (e.g., "add a hat to the person," "change the background to a beach").
-   ✂️ **Precision Cropping:** A core feature to select the exact region you want to edit, ensuring the AI's focus is precise.
-   🚀 **Selectable Editing Styles:** Choose between a **Standard** model for reliable edits or a **Creative** model for more artistic results.
-   🎚️ **Edit Intensity Control:** Fine-tune the strength of the AI's changes with a post-processing slider to blend the original and edited images.
-   📤 **Easy Image Upload:** Drag-and-drop or file selection with a real-time progress indicator for large files.
-   💾 **Download Final Image:** Easily download the final edited image, including any intensity adjustments.
-   📱 **Fully Responsive:** Works beautifully on both desktop and mobile devices.
-   💡 **Intuitive UI:** A clean, modern interface built with Material 3 principles, providing clear loading states and error messages.

## 🚀 How to Use

1.  **Upload an Image:** Drag and drop an image or click to select a file.
2.  **Crop Your Image:** Adjust the selection box to frame the area you want to edit, then click "Confirm Selection".
3.  **Choose a Style:** Select "Standard" or "Creative" for your desired outcome.
4.  **Describe Your Edit:** Type a clear prompt in the text area.
5.  **Apply Magic:** Click "Apply Edit" and watch the AI work!
6.  **Adjust & Refine:** Use the "Edit Intensity" slider to get the perfect blend.
7.  **Download:** Click "Download Edited Image" to save your creation.
8.  **Reset:** Use the "Start Over" button to begin a new project.

## 💻 Technology Stack

-   **Frontend:** React, TypeScript
-   **AI Model:** Google Gemini (`gemini-2.5-flash-image-preview`)
-   **SDK:** `@google/genai`
-   **Styling:** Tailwind CSS (following Material 3 principles)
-   **Image Cropping:** `react-image-crop`

## 📁 File Structure

The project is organized with a clear and maintainable structure:

```
.
├── index.html              # Main HTML entry point
├── index.tsx               # React application root
├── App.tsx                 # Main application component, manages state and layout
├── types.ts                # Shared TypeScript types and enums
├── services/
│   └── geminiService.ts    # Handles all communication with the Gemini API
└── components/
    ├── EditControls.tsx    # UI for prompt input, model selection, etc.
    ├── ImageCropper.tsx    # Cropping component and logic
    ├── ImageUploader.tsx   # Component for uploading images
    ├── ImageViewer.tsx     # Displays the final image, slider, and download button
    └── ...and more
```

## 🛠️ Local Development

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/sapthesh/AI-Photo-Editor-Nano-Banana.git
    cd AI-Photo-Editor-Nano-Banana
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env` file in the root of the project and add your Google Gemini API key:
    ```
    API_KEY="YOUR_GEMINI_API_KEY"
    ```
    > **Note:** In the intended development environment (like Google AI Studio), this key is pre-configured and does not need to be set manually.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

This will start the application, and you can access it in your browser at the local address provided.

---
© sapthesh
