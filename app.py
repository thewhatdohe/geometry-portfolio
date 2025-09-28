from flask import Flask, render_template, send_from_directory, abort
import os

app = Flask(__name__)

# Home route
@app.route('/')
def home():
    return render_template('index.html')

# Serve unit HTML files
@app.route('/units/<unit_name>')
def load_unit(unit_name):
    units_dir = os.path.join(app.root_path, 'units')
    filename = f"{unit_name}.html"
    if os.path.exists(os.path.join(units_dir, filename)):
        return send_from_directory(units_dir, filename)
    else:
        abort(404, description="Unit not found")

# Serve lesson HTML files inside /units/lessons/
@app.route('/lessons/<lesson_name>.html')
def load_lesson(lesson_name):
    lessons_dir = os.path.join(app.root_path, 'units', 'lessons')
    filename = f"{lesson_name}.html"
    if os.path.exists(os.path.join(lessons_dir, filename)):
        return send_from_directory(lessons_dir, filename)
    else:
        abort(404, description="Lesson not found")

if __name__ == '__main__':
    app.run(debug=True)