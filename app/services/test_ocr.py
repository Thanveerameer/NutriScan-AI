from ocr_service import extract_text_from_scanned_pdf


pdf_path = "static/uploads/test.pdf"

text = extract_text_from_scanned_pdf(pdf_path)

print(text)