
// import needed packages
const fs = require('fs');
const frontMatter = require('front-matter');
const Handlebars = require('handlebars');
const showdown = require('showdown');
const converter = new showdown.Converter({tables: true, literalMidWordUnderscores: true})
const cheerio = require('cheerio');

// inject nav bar and footer
const navbarPartial = fs.readFileSync('src/templates/navbar.html', 'utf-8')
const footerPartial = fs.readFileSync('src/templates/footer.html', 'utf-8')

Handlebars.registerPartial('navbar', navbarPartial);
Handlebars.registerPartial('footer', footerPartial);

// get all files
const indexSource = fs.readFileSync('src/content/index.html', 'utf-8');
const blogLandingSource = fs.readFileSync('src/content/blog.html', 'utf-8');
const blogTemplateSource = fs.readFileSync('src/content/blog_post.html', 'utf-8');
const cvSource = fs.readFileSync('src/content/cv.html', 'utf-8');
const blogPosts = fs.readdirSync('src/content/posts');
// compile all files

const index = Handlebars.compile(indexSource);
const blogLanding = Handlebars.compile(blogLandingSource);
const blogTemplate = Handlebars.compile(blogTemplateSource);
const cv = Handlebars.compile(cvSource);

// create posts as html files from .md
const listOfPosts = [];
blogPosts.forEach(blogPost => {
    const post = fs.readFileSync(`src/content/posts/${blogPost}`, 'utf-8');
    const {attributes, body} = frontMatter(post);
    attributes.path = `/dist/posts/${attributes.title}.html`;
    attributes.date = attributes.date.toLocaleDateString('en-us', {month: "short", day: "numeric", year: "numeric"});
    listOfPosts.push(attributes);
    console.log(converter.makeHtml(body));
    const $ = cheerio.load(converter.makeHtml(body));
    const titles = [];

    // Select all <h1> and <h2> elements and store their text content in the object
    $('h1, h2').each((index, element) => {
        const tag_type = element.tagName.toLowerCase();
        const title = $(element).text().trim();
        const ref = "#" + title.toLowerCase().replace(/\s/g, '');
        titles.push({ tag_type, title, ref});
    });
    fs.writeFileSync(`dist/posts/${attributes.title}.html`, blogTemplate({'title': attributes.title, 'date': attributes.date, 'titles': titles, 'content': converter.makeHtml(body)}));
});

console.log(listOfPosts);
// Sort the listOfPosts array in descending order based on the date attribute
listOfPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

fs.writeFileSync(`dist/blog.html`, blogLanding({listOfPosts}));
fs.writeFileSync('index.html', index({'recentProjects': listOfPosts.slice(0, 3)}));

// write cv

// build CV Section

fs.writeFileSync('dist/cv.html', cv(undefined, undefined));