# Nano Banana AI Photo Editor

This is an AI-powered photo editing application that allows users to upload an image, select a region, and describe edits using natural language. It leverages the powerful Google Gemini `gemini-2.5-flash-image-preview` model (also known as Nano Banana) to generate high-quality, context-aware image modifications.

The user interface is designed to be modern, intuitive, and responsive, following Google's Material 3 design principles.

## Features

- **Image Upload:** Supports drag-and-drop and file selection for uploading images (PNG, JPG, WEBP, etc.). Includes a real-time progress indicator for large files.
- **Image Cropping:** A core feature that allows users to select a specific region of the image to edit, ensuring the AI's focus is precise.
- **AI-Powered Editing:** Users can describe complex edits in plain English (e.g., "add a hat to the person," "change the background to a beach").
- **Selectable Editing Styles:** Choose between a "Standard" model for reliable edits or a "Creative" model for more artistic and dramatic results.
- **Edit Intensity Control:** A post-processing slider allows users to blend the original and edited images, giving fine-grained control over the final effect's strength.
- **Download Image:** Easily download the final edited image, including any intensity adjustments.
- **Responsive UI:** The application is fully responsive and works seamlessly on both desktop and mobile devices.
- **Clear User Feedback:** Provides clear loading states, progress indicators, and descriptive error messages to guide the user.

## How to Use

1.  **Upload an Image:** Drag and drop an image file onto the upload area or click to select a file from your device.
2.  **Crop Your Image:** An interactive cropping tool will appear. Adjust the selection box to frame the exact area you want the AI to edit. Click "Confirm Selection".
3.  **Choose Editing Style:** Select either "Standard" or "Creative" to match your desired outcome.
4.  **Describe Your Edit:** In the text area, type a clear and descriptive prompt for the changes you want to make.
5.  **Apply Edit:** Click the "Apply Edit" button to send your request to the Gemini API. A loading indicator will show while the AI processes the image.
6.  **View and Adjust:** The edited image will appear. Use the "Edit Intensity" slider to blend the result with the original image until you're satisfied.
7.  **Download:** Click the "Download Edited Image" button to save the final result to your device.
8.  **Start Over:** Use the "Start Over" button at any time to clear the current image and begin a new edit.

## Technology Stack

- **Frontend:** React, TypeScript
- **AI Model:** Google Gemini (`gemini-2.5-flash-image-preview`) via the `@google/genai` SDK
- **Styling:** Tailwind CSS for a utility-first, modern design system aligned with Material 3 principles.
- **Image Cropping:** `react-image-crop` library for the interactive cropping UI.

## File Structure

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
    ├── EditControls.tsx    # UI for prompt input, model selection, and action buttons
    ├── Footer.tsx          # Application footer
    ├── Header.tsx          # Application header
    ├── ImageCropper.tsx    # Cropping component and logic
    ├── ImageUploader.tsx   # Component for uploading images
    ├── ImageViewer.tsx     # Displays the edited image, intensity slider, and download button
    ├── Spinner.tsx         # Loading spinner component
    └── icons/              # SVG icon components
```

## Local Development

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
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
    *Note: In the development environment this project is intended for, this key is pre-configured and does not need to be set manually.*

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

This will start the application, and you can access it in your browser at the local address provided.

---
© 2025 sapthesh
