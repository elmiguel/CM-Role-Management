
let ns = $ninja('.ninja-shadow')
ns.on('click', function(){
  console.log('Ninja Clicked!')
})

console.log(ns)
let h3 = $ninja('h3')
h3.on('click', function(){
  let current = this
  $ninja(current).html('Hello!')
  setTimeout(function(){
    $ninja(current).html('Do it again, do it again!')
  }, 3000)
})

console.log($ninja('h3').attr('ninja'))
console.log($ninja('h3').attr('ninja', 'Works!'))
console.log($ninja('h3').hasAttr('ninjas'))

let n = $ninja('#ninja')
n.html('How awesome is this! (Click me I change)')
console.log(n.html())

n.css("color: #222")
n.css({color: "#222", backgroundColor: "#ededed", padding: "2em"})

console.log(n.css())
n.addClass('some-ninja-class')

// will not add if already existing ;)
n.addClass('some-ninja-class')

// will remove only if the class already exists
n.removeClass('some-ninja-class')


// second argument is the params (urlencoded)
$ninja().get('https://jsonplaceholder.typicode.com/posts/1', '', function(data){
  console.log('$ninja().get()', data)
})

let data = { id: 1, title: 'foo', body: 'bar', userId: 1 }
$ninja().post(
  'http://jsonplaceholder.typicode.com/posts',
  data,
  function(data){
    console.log('$ninja().post()', data)
  }
)

$ninja().put(
  'http://jsonplaceholder.typicode.com/posts/1',
  data,
  function(data){

    let template = $ninja('#async-data').html()
    let rendered = Handlebars.compile(template)
    $ninja('[async-data]').html(rendered(data))
    console.log('$ninja().put()', data)
  }
)

$ninja().delete('https://jsonplaceholder.typicode.com/posts/1', function(data){
  console.log('$ninja().delete()', data)
})

// Ninja, decided to add these later on ;p 
n.before('<p>I was inserted before #ninja with before()! Yay!</p>')
n.after('<p>I was inserted after #ninja with after()! Yay!</p>')
