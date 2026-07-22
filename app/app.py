from flask import Flask, render_template, request, redirect, flash
import os
from werkzeug.utils import secure_filename
from services.pdf_service import extract_text_from_pdf

app = Flask(__name__)

app.secret_key = "nutriscan_secret_key"


# Upload Folder
UPLOAD_FOLDER = os.path.join(app.static_folder, "uploads")
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


# Allowed Extensions
ALLOWED_EXTENSIONS = {"pdf"}


# Home Page
@app.route("/")
def home():
    return render_template("index.html")


# Check PDF
def allowed_file(filename):
    return "." in filename and \
           filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


# Upload Page
@app.route("/upload", methods=["GET", "POST"])
def upload():

    if request.method == "POST":

        if "report" not in request.files:
            flash("Please select a PDF file.")
            return redirect(request.url)


        file = request.files["report"]


        if file.filename == "":
            flash("No file selected.")
            return redirect(request.url)


        if file and allowed_file(file.filename):

            filename = secure_filename(file.filename)


            save_path = os.path.join(
                app.config["UPLOAD_FOLDER"],
                filename
            )


            # Save PDF
            file.save(save_path)


            # Extract PDF Text
            extracted_text = extract_text_from_pdf(save_path)


            print("----- Extracted PDF Text -----")
            print(extracted_text)
            print("------------------------------")


            flash("Blood Report uploaded successfully!")

            return redirect("/upload")


        else:

            flash("Only PDF files are allowed.")

            return redirect(request.url)


    return render_template("upload.html")



if __name__ == "__main__":
    app.run(debug=True)