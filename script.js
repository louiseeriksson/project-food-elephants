const today = document.getElementById('currentWeather')
const CityId = 260;
const CousineId = 168;
const apiKey = "6ce41007f9563dde23befa59a0baa050";
const filterBook = document.getElementById('bookClicked')
const clearBtn = document.getElementById('resetBtn')
const gridBox = document.getElementById('gridRestaurant')

let myList

const url = `https://developers.zomato.com/api/v2.1/search?entity_id=${CityId}&entity_type=city&cuisines=${CousineId}&start=0&count=20`


const fetchRestaurants = () => {

  fetch(url, { headers: { "user-Key": apiKey } })
    .then(res => res.json())
    .then(json => {
      console.log(json.restaurants)
      myList = restaurantList(json.restaurants)
      //const listF = filterRate(myList)

      showRestaurant(myList)

      reviewFunc(myList)
      //review("16566183")
      object = document.getElementById('filter')
      object.addEventListener("click", (e) => {
        e.preventDefault()
        filterRate(myList)


      });
    })
}

fetchRestaurants()
const restaurantList = (Alist) => {
  const newList = []
  Alist.forEach(element => {
    newList.push({
      name: element.restaurant.name,
      id: element.restaurant.id,
      address: element.restaurant.location.address,
      cost: `${element.restaurant.currency}${element.restaurant.average_cost_for_two}`,
      price: element.restaurant.price_range,
      photo: element.restaurant.featured_image,
      offers: element.restaurant.highlights,
      rating: element.restaurant.user_rating.aggregate_rating,
      ratingT: element.restaurant.user_rating.rating_text,
      bookTable: element.restaurant.is_table_reservation_supported
    })

  });
  return newList
}

const showRestaurant = (aList) => {
  const gridBox = document.getElementById('gridRestaurant')
  aList.forEach((item, index, arr) => {
    let offers = item.offers.map(offer => `<span> ${offer}</span>`);
    gridBox.innerHTML += `<article id="art${item.id}"><img src="${item.photo}"><p>${item.name}</p>
    <!--  <p>${offers}</p> -->
    <p>${item.rating}/5</p><p>${item.price} </p></article>`

  })
}

// const listFunction = (fullList, smallList) => {
//   const gridBox = document.getElementById('gridRestaurant')
//   gridBox.innerHTML = ""

// }


const reviewFunc = (aList) => {

  aList.forEach((item) => {
    let url = `https://developers.zomato.com/api/v2.1/reviews?res_id=${item.id}`
    fetch(url, { headers: { "user-Key": apiKey } })
      .then(res => res.json())
      .then(json => {
        console.log(json)
        //const restaurantId = number
        const myReviews = reviewObject(json, item.id)
        showRev(myReviews)

      })

  })
}




const reviewObject = (object, idN) => {
  const newList = []
  newList.push(idN)
  newList.push(object.reviews_count)
  const reviewList = object.user_reviews
  reviewList.forEach((item) => {
    newList.push({
      ratingN: item.review.rating,
      ratingT: item.review.rating_text,
      name: item.review.user.name,
      date: (new Date(item.review.timestamp * 1000)).toUTCString()
    })

  })
  console.log(newList)
  return newList
}

const showRev = (alist) => {
  const id = `art${alist[0]}`
  console.log(id)
  const myBox = document.getElementById(id)
  console.log(myBox)
  myBox.innerHTML += `<h3>Reviews</h3>`
  alist.forEach((item, index) => {
    if (index > 1) {
      myBox.innerHTML += `<p>Rating: ${item.ratingT}, User: ${item.name}</p>`
    }



  })

}

const filterRate = (arr) => {
  const gridBox = document.getElementById('gridRestaurant')
  gridBox.innerHTML = ""
  const filterList = arr.filter((item) => {
    return (parseFloat(item.rating) > 4.5)
  })

  console.log("filteredlist,", filterList)


  filterList.forEach((item, index, arr) => {
    let offers = item.offers.map(offer => `<span> ${offer}</span>`);
    gridBox.innerHTML += `<article id="art${item.id}" class="small-card">
    <section>
      <img src="${item.photo}">
    </section>
    
    <section>
      <p>${item.name}</p>
      <!-- <p>${offers}</p> -->
      <p>${item.rating}/5</p><p>${item.price} </p>
    </section>
    </article>`
  })
}

const clearFunction = () => {
  location.reload()
}

const bookFilter = (arr) => {
  const bookableTables = arr.filter((item) => {
    return item.bookTable == 1
    
  })
  gridBox.innerHTML = ''
  bookableTables.forEach((item) => {
    let offers = item.offers.map(offer => `<span> ${offer}</span>`);
    gridBox.innerHTML += `<article class="small-card">
    <section>
      <img src="${item.photo}">
    </section>
    
    <section>
      <p>${item.name}</p>
      <!-- <p>${offers}</p> -->
      <p>${item.rating}/5</p><p>${item.price} </p>
    </section>
    </article>`
  })

  return bookableTables
}

filterBook.addEventListener('click', () => bookFilter(myList))
clearBtn.addEventListener('click', () => clearFunction())
