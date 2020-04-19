// Dummy data placeholder. Replace with array of actual data objects to come from Airtable 
const data = [
{
  "project": "Project X",
  "stack": ["react", "express", "node"],
  "description": "Some sample text giving project elevator pitch and blah blah and other stuff and goals and dreams and rainbows and butterflies and sunshine. ",
  "website": "https://www.google.com",
  "github": "https://www.github.com",
  "image": "https://s3-us-west-2.amazonaws.com/s.cdpn.io/326643/Sample%20Logo.png",
  "needs": "People with super powers",
  "status": "In Development" },

{
  "project": "Project XYZ",
  "stack": ["python", "django"],
  "description": "Some sample text giving project elevator pitch and blah blah and other stuff and goals and dreams and rainbows and butterflies and sunshine. ",
  "website": "https://www.google.com",
  "github": "https://www.github.com",
  "needs": "People with super powers, semi-super powers, or no powers at all",
  "image": "https://s3-us-west-2.amazonaws.com/s.cdpn.io/326643/sample%20logo%202.png",
  "status": "Live" },
{
  "project": "Project X",
  "stack": ["react", "express", "node"],
  "description": "Some sample text giving project elevator pitch and blah blah and other stuff and goals and dreams and rainbows and butterflies and sunshine. ",
  "website": "https://www.google.com",
  "github": "https://www.github.com",
  "image": "https://s3-us-west-2.amazonaws.com/s.cdpn.io/326643/Sample%20Logo.png",
  "needs": "People with super powers",
  "status": "In Development" },

{
  "project": "Project XYZ",
  "stack": ["python", "django"],
  "description": "Some sample text giving project elevator pitch and blah blah and other stuff and goals and dreams and rainbows and butterflies and sunshine. ",
  "website": "https://www.google.com",
  "github": "https://www.github.com",
  "needs": "People with super powers, semi-super powers, or no powers at all",
  "image": "https://s3-us-west-2.amazonaws.com/s.cdpn.io/326643/sample%20logo%202.png",
  "status": "Live" },
{
  "project": "Project X",
  "stack": ["react", "express", "node"],
  "description": "Some sample text giving project elevator pitch and blah blah and other stuff and goals and dreams and rainbows and butterflies and sunshine. ",
  "website": "https://www.google.com",
  "github": "https://www.github.com",
  "image": "https://s3-us-west-2.amazonaws.com/s.cdpn.io/326643/Sample%20Logo.png",
  "needs": "People with super powers",
  "status": "In Development" },

{
  "project": "Project XYZ",
  "stack": ["python", "django"],
  "description": "Some sample text giving project elevator pitch and blah blah and other stuff and goals and dreams and rainbows and butterflies and sunshine. ",
  "website": "https://www.google.com",
  "github": "https://www.github.com",
  "needs": "People with super powers, semi-super powers, or no powers at all",
  "image": "https://s3-us-west-2.amazonaws.com/s.cdpn.io/326643/sample%20logo%202.png",
  "status": "Live" }];



function Layout(props) {
  return (
    React.createElement("div", { className: "row" }, props.children));

}

class cards extends React.Component {
  render() {
    const style = {
      img: {
        maxWidth: "400px" } };


    return (
      React.createElement("div", { className: "col m4" },
      React.createElement("div", { className: "cards hoverable" },
      React.createElement("div", { className: "cards-image waves-effect waves-block waves-light" },
      React.createElement("img", { style: style.img, className: "activator", src: this.props.data.image })),

      React.createElement("div", { className: "cards-content" },
      React.createElement("div", null,
      React.createElement(Stackiconss, { data: this.props.data.stack })),

      React.createElement("span", { className: "cards-title activator grey-text text-darken-4" },
      this.props.data.project,
      React.createElement("i", { className: "material-iconss right" }, "more_vert")),

      React.createElement("div", null,
      React.createElement("span", null, React.createElement("a", { href: this.props.data.website }, "Website")),
      React.createElement("span", null, React.createElement("a", { className: "github", href: this.props.data.github }, "Github")))),


      React.createElement("div", { className: "cards-reveal" },
      React.createElement("span", { className: "cards-title grey-text text-darken-4" }, this.props.data.project, React.createElement("i", { className: "material-iconss right" }, "close")),
      React.createElement("div", null, React.createElement("span", { className: "status" }, this.props.data.status)),
      React.createElement("p", null, this.props.data.description),
      React.createElement("p", null, React.createElement("strong", null, "Need:")),
      React.createElement("p", null, this.props.data.needs)))));




  }}


// Note: Empty span tag on line 115 is there as placeholder for
// the custom CSS to inject text based on stack item.
function Stackiconss(props) {
  const array = props.data;
  const iconss = array.map(item => {
    return (
      React.createElement("div", { key: item, className: "icons" },
      React.createElement("span", { className: item }, React.createElement("span", null))));


  });
  return (
    React.createElement("div", null, " ", iconss, " "));

}

function Projects(props) {
  const projects = [];
  const data = props.data;
  data.forEach(item => {projects.push(React.createElement(cards, { data: item }));});
  return (
    React.createElement("div", null, projects));

}

ReactDOM.render(
React.createElement(Layout, { children: React.createElement(Projects, { data: data }) }),
document.getElementById('root'));