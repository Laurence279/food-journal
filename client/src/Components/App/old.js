  // Create async function for fetching users list
  const fetchUsers = async () => {
    const users = await fetch('/users/all')
      .then(res => res.json()) // Process the incoming data

    // Update usersList state
    setUsersList(users)
  }


  function onPrev() {
    setDate(function (prev) {
      const yesterday = new Date(prev);
      yesterday.setDate(yesterday.getDate() - 1);
      addToArray(yesterday.toDateString());
      return yesterday;
    });
  }

  function onNext() {
    setDate(function (prev) {
      const tomorrow = new Date(prev);
      tomorrow.setDate(tomorrow.getDate() + 1);
      if (tomorrow >= today) {
        return today;
      }
      addToArray(tomorrow.toDateString());
      return tomorrow;
    });
  }

  function checkIfDateExists(now) {
    const arr = objects.filter(function (item) {
      return item.Date === now;
    });
    return arr;
  }

  function addToArray(time) {
    if (checkIfDateExists(time).length === 0) {
      const object = { Date: time, Morning: [], Afternoon: [], Evening: [] };
      setObj(function () {
        return object;
      });
      saveObjects(object);
    } else {
      loadFromArray(time);
    }
  }

  function loadFromArray(time) {
    console.log("Attempting to load object");
    console.log(checkIfDateExists(time)[0]);
    setObj(function () {
      return checkIfDateExists(time)[0];
    });
  }

  function saveObjects(object) {
    setObjects(function (prev) {
      return [...prev, object];
    });
  }

  function addFoodItem(time, food, foodTypes) {

    if (food === "" && foodTypes.length === 0) {
      return;
    }
    const foodObject = {
      id: (Math.random().toString(36).substr(2, 18)),
      name: food === "" ? `Generic ${foodTypes.join(", ")}` : food,
      type: foodTypes.length === 0 ? ["Other"] : foodTypes
    };
    switch (time) {
      case "Morning":
        setObj(function (prevValue) {
          return {
            ...prevValue,
            Date: date.toDateString(),
            [time]: [...prevValue.Morning, foodObject]
          };
        });
        break;
      case "Afternoon":
        setObj(function (prevValue) {
          return {
            ...prevValue,
            Date: date.toDateString(),
            [time]: [...prevValue.Afternoon, foodObject]
          };
        });
        break;
      case "Evening":
        setObj(function (prevValue) {
          return {
            ...prevValue,
            Date: date.toDateString(),
            [time]: [...prevValue.Evening, foodObject]
          };
        });
        break;
      default:
        break;
    }
    updateObjects(time, foodObject);
  }

  function updateObjects(time, foodObject) {
    //save object as new and filter out old one
    const updatedObject = obj;
    updatedObject[time].push(foodObject);
    setObjects(function (prev) {
        return [
          ...prev.filter(function (item) {
            return item.Date !== obj.Date;
          }),
          updatedObject
        ];
    });
    post(foodObject, time);
  }

  function delUpdateObjects(id, time){
    const updatedObject = obj;
    const newArray = updatedObject[time].filter(function(e){
      return e.id !== id 
    })
    updatedObject[time] = newArray;
    setObjects(function(prev){
      return [
        ...prev.filter(function (item) {
          return item.Date !== obj.Date;
        }),
        updatedObject
      ];
    });
    deletePost(id, time);
  }

  function checkIfEntries() {
    if (
      obj.Morning.length === 0 &&
      obj.Afternoon.length === 0 &&
      obj.Evening.length === 0
    ) {
      setIsEmpty(function () {
        return "No Entries";
      });
    } else {
      setIsEmpty(function () {
        return "";
      });
    }
  }

  function deleteEntry(id, array) {
    console.log(`Object with id ${id} deleted from ${array}`);

    console.log(obj[array][id]);

    setObj(function (prev) {
      return {
        ...prev,
        [array]: [
          ...prev[array].filter(function (item, index) {
            return item.id !== id
          })
        ]
      };
    });
    delUpdateObjects(id, array);
  }

    // Create async function for fetching welcome message
    const fetchMessage = async () => {


      return 



      // Use Fetch API to fetch '/api' endpoint
      const username = await fetch(`/api`)
        .then(res => res.json())
        .then(data => 
          
          {
        console.log(data)
        setUser(function()
            {
              return data
            })
       setObjects(function()
            {
           return data.days;
           })
        const index = data.days.findIndex(item => item.Date === date.toDateString());
        if (index !== -1){
          setObj(function(){
            return data.days[index]})// process incoming data
        }

  
  })
    }

    const fetchUser = async (name) => {

      return

      // Use Fetch API to fetch '/api' endpoint
      const username = await fetch(`api/find/${name}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setUser(function () {
            return data;
          });
          setObjects(function () {
            return data.days;
          });
          const index = data.days.findIndex(
            (item) => item.Date === date.toDateString()
          );
          if (index !== -1) {
            setObj(function () {
              return data.days[index];
            }); // process incoming data
          }
          else{
            setObj(function(){
              return {
                Date: date.toDateString(),
                Morning: [],
                Afternoon: [],
                Evening: []
              }
            })
          }
        });
    };

      
  
    // Use useEffect to call fetchMessage() on initial render
    useEffect(() => {

     fetchMessage();

    }, [])// empty dependency array means this effect will only run once (like componentDidMount in classes)


    useEffect(function(){
     checkIfEntries();
    })




    function post(foodObject, time){
      const objectSent = {
        object: objects,
        objectToAdd: foodObject,
        whenToAdd: date.toDateString(),
        whereToAdd: time
      }
        fetch(`/api/post/${user.user}`, {method: 'POST',
        headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
         },
      body: JSON.stringify(objectSent)})
      .then(function(response) {
        return response;
      })
      .then(function(res){
        console.log(res + "hi")
      })
    }

    function deletePost(id, time){
      const objectSent = {object: objects, objectToDelete: {
        id: id,
        time: time,
        date: date.toDateString()
      }}
      fetch(`/api/delete/${user.user}`, {method: 'POST',
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       },
    body: JSON.stringify(objectSent)})
    .then(function(response) {
      return response;
    })
    .then(function(res){
      console.log(res + "hi")
    })}

    return (
    
        <div>
          <header>
          <div>
          <button className="user-btn" onClick={() => fetchUser("Laur")}>Laur</button>
              <button className="user-btn" onClick={() => fetchUser("Tasha")}>Tasha</button>
            </div>
            <h1>Dietary Journal</h1>
            <h3>{user.user}</h3>
            <Day date={date.toDateString()} onPrev={onPrev} onNext={onNext} />
          </header>
          <h2 className="today-title">{isEmpty}</h2>
          <TimeOfDay time="Morning" array={obj.Morning} deleteEntry={deleteEntry} />
          <TimeOfDay
            time="Afternoon"
            array={obj.Afternoon}
            deleteEntry={deleteEntry}
          />
          <TimeOfDay time="Evening" array={obj.Evening} deleteEntry={deleteEntry} /> 
          <Input whenSubmit={addFoodItem} />
        </div>
    
      );