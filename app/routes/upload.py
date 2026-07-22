from flask import Blueprint, render_template, request, redirect, url_for
import os

from services.pdf_service import extract_text_from_pdf


upload_bp = Blueprint("upload", __name__)

UPLOAD_FOLDER = "app/static/uploads"


@upload_bp.route("/upload", methods=["GET", "POST"])
def upload_file():

    if request.method == "POST":

        file = request.files.get("file")

        if file and file.filename.endswith(".pdf"):

            filepath = os.path.join(
                UPLOAD_FOLDER,
                file.filename
            )

            file.save(filepath)

            # PDF Text Extraction
            extracted_text = extract_text_from_pdf(filepath)

            print("----- Extracted PDF Text -----")
            print(extracted_text)
            print("------------------------------")

            return "PDF uploaded and text extracted successfully"

        else:
            return "Please upload a valid PDF file"

    return render_template("upload.html")