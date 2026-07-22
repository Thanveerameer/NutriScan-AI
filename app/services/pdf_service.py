import fitz   # PyMuPDF


def extract_text_from_pdf(pdf_path):

    text = ""

    try:
        pdf_document = fitz.open(pdf_path)

        for page in pdf_document:
            text += page.get_text()

        pdf_document.close()

        return text

    except Exception as e:
        return f"Error extracting PDF: {str(e)}"