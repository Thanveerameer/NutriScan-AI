import os

from flask import (
    Flask,
    render_template,
    request,
    redirect,
    url_for,
    flash
)

from werkzeug.utils import secure_filename


from services.pdf_service import extract_text_from_pdf
from services.ai_service import analyze_blood_report

from routes.dashboard import (
    dashboard_bp,
    parse_ai_response
)


app = Flask(__name__)


app.secret_key = "nutriscan_secret_key"


# Register Dashboard Blueprint

app.register_blueprint(
    dashboard_bp
)



UPLOAD_FOLDER = os.path.join(
    "static",
    "uploads"
)


ALLOWED_EXTENSIONS = {"pdf"}


app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


os.makedirs(
    app.config["UPLOAD_FOLDER"],
    exist_ok=True
)



def allowed_file(filename):

    return (
        "." in filename
        and filename.rsplit(".", 1)[1].lower()
        in ALLOWED_EXTENSIONS
    )




@app.route("/")
def home():

    return render_template("index.html")




@app.route("/upload")
def upload():

    return render_template("upload.html")





@app.route(
    "/upload",
    methods=["POST"]
)
def upload_file():


    if "report" not in request.files:

        flash("Please choose a PDF file.")

        return redirect(request.url)



    file = request.files["report"]



    if file.filename == "":

        flash("Please select a PDF.")

        return redirect(request.url)



    if not allowed_file(file.filename):

        flash("Only PDF files are allowed.")

        return redirect(request.url)



    filename = secure_filename(
        file.filename
    )


    filepath = os.path.join(
        app.config["UPLOAD_FOLDER"],
        filename
    )


    file.save(filepath)



    print("\n========== PDF SAVED ==========")

    print(filepath)



    extracted_text = extract_text_from_pdf(
        filepath
    )



    print("\n========== EXTRACTED TEXT ==========\n")

    print(extracted_text)



    if extracted_text.strip() == "":

        flash(
            "Unable to extract text from PDF."
        )

        return redirect(
            url_for("upload")
        )



    print("\n========== SENDING TO GROQ ==========\n")



    ai_result = analyze_blood_report(
        extracted_text
    )



    print(ai_result)



    print(
        "\n========== GROQ RESPONSE RECEIVED ==========\n"
    )



    # Split AI response into dashboard sections

    dashboard_data = parse_ai_response(
        ai_result
    )



    return render_template(

        "dashboard.html",

        patient_summary=dashboard_data["patient_summary"],

        lab_explanation=dashboard_data["lab_explanation"],

        nutrition=dashboard_data["nutrition"],

        lifestyle=dashboard_data["lifestyle"],

        doctor_points=dashboard_data["doctor_points"],

        disclaimer=dashboard_data["disclaimer"],

        filename=filename

    )






@app.errorhandler(404)
def page_not_found(error):

    return (

        render_template(
            "result.html",
            message="Page Not Found."
        ),

        404

    )





@app.errorhandler(500)
def internal_server_error(error):

    return (

        render_template(

            "result.html",

            message="Something went wrong while processing your request."

        ),

        500

    )






if __name__ == "__main__":


    app.run(
        debug=True
    )