import fitz   # PyMuPDF

from services.ocr_service import extract_text_from_scanned_pdf


def extract_text_from_pdf(pdf_path):

    text = ""

    try:

        pdf_document = fitz.open(pdf_path)

        # First try normal PDF text extraction
        for page in pdf_document:
            text += page.get_text()

        pdf_document.close()


        # If text exists, return it
        if text.strip():
            return text


        # If no text, run OCR
        print("No text found. Starting OCR...")

        ocr_text = extract_text_from_scanned_pdf(pdf_path)

        return ocr_text


    except Exception as e:

        return f"Error extracting PDF: {str(e)}"