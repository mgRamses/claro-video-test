import React, {useState, useRef, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import useFetch from './hooks/useFetch'
import leftArrow from './icons/LeftArrow.svg'
import rightArrow from './icons/RightArrow.svg'

function App() {
  const url = 'https://mfwkweb-api.clarovideo.net/services/epg/channel?'
  const totalChannelsToDisplay = 15;
  const { data, loading, error } = useFetch(url, totalChannelsToDisplay)
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')

  const maxScrollWidth = useRef(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const carousel = useRef<HTMLInputElement>(null);

  const [startHour, setStartHour] = useState('')
  const [endtHour, setEndHour] = useState('')
  const [startMinutes, setStartMinutes] = useState('')
  const [endMinutes, setEndMinutes] = useState('')

  const movePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevState) => prevState - 1);
    }
  };

  const moveNext = () => {
    if (
      carousel.current !== null &&
      carousel.current.offsetWidth * currentIndex <= maxScrollWidth.current
    ) {
      setCurrentIndex((prevState) => prevState + 1);
    }
  };

  const isDisabled = (direction: string) => {
    if (direction === 'prev') {
      return currentIndex <= 0;
    }

    if (direction === 'next' && carousel.current !== null) {
      console.log(carousel.current.offsetWidth)
      console.log(currentIndex)
      console.log(maxScrollWidth.current)
      console.log(carousel.current.offsetWidth * currentIndex >= maxScrollWidth.current)

      return (
        carousel.current.offsetWidth * currentIndex >= maxScrollWidth.current
      );
    }

    return false;
  };

  const updateDescription = (channelId: number, idx: number) => {
    // @ts-ignore
    setTitle(data?.response.channels[channelId].events[idx].name)
    // @ts-ignore
    setDescription(data?.response.channels[channelId].events[idx].description)
    // @ts-ignore
    setStartHour(new Date(data?.response.channels[channelId].events[idx].date_begin).getHours())
    // @ts-ignore
    setEndHour(new Date(data?.response.channels[channelId].events[idx].date_end).getHours())
    // @ts-ignore
    setStartMinutes(new Date(data?.response.channels[channelId].events[idx].date_begin).getMinutes())
    // @ts-ignore
    setEndMinutes(new Date(data?.response.channels[channelId].events[idx].date_end).getMinutes())
  }

  const getHours = (start: Date | number, end: Date | number) => {
    let startHours = 0;
    if(typeof start === 'object'){
      startHours = start.getHours()
    }else{
      startHours = start
    }

    let endHours = 0;
    if(typeof end === 'object'){
      endHours = end.getHours()
    }else{
      endHours = end
    }
    return  endHours - startHours
  }

  const get24Hours = () => {
    var x = 30; //minutes interval
    var times = []; // time array
    var tt = 0; // start time

    //loop to increment the time and push results in array
    for (var i=0; tt < 24*60; i++) {
      var hh = Math.floor(tt/60); // getting hours of day in 0-24 format
      var mm = (tt%60); // getting minutes of the hour in 0-55 format
      times[i] = ("0" + hh).slice(-2) + ':' + ("0" + mm).slice(-2); // pushing data in array in [00:00 - 12:00 AM/PM format]
      tt = tt + x;
    }

    return times;
  }

  useEffect(() => {
    if (carousel !== null && carousel.current !== null) {
      carousel.current.scrollLeft = carousel.current.offsetWidth * currentIndex;
    }
  }, [currentIndex]);

  useEffect(() => {
    maxScrollWidth.current = carousel.current
      ? carousel.current.scrollWidth - carousel.current.offsetWidth
      : 0;

      console.log(maxScrollWidth.current)
  }, []);

  return (
    <div className="App" style={{position: 'relative', height: '100vh', width:'100%', textAlign: 'left'}}>
      {
        loading ? <div>Loading...</div> : 
          <div style={{position: 'relative', height: '100vh', width: '100vw'}}>
            <div style={{padding: '10px'}}>
              <div style={{width: '30%', color: 'white', fontSize: '36px'}}>{title}</div>
              <div style={{width: '50%', color: 'white', fontSize: '18px', margin: '10px 0'}}>{startHour.toString()}.{startMinutes.toString()}hrs - {endtHour.toString()}.{endMinutes.toString()}hrs</div>
              <div style={{width: '50%', color: 'white', fontSize: '24px'}}>{description}</div>
            </div>
            
            <div className="wrap">
              <div className="timeline">
                <div style={{flex:'none', color:'white', textAlign:'center', width: '168px', height: '100%', backgroundColor: 'black',  position: 'sticky', left: 0}}>HOY</div>
                  <div style={{display: 'flex', flexDirection: 'row'}} >
                    {
                      get24Hours().map((hour)=>(<div style={{display:'flex', alignItems: 'center', fontSize: '12px', color: 'white', minWidth: '130px', flexGrow: 1, height: '32px'}}>{hour}hrs.</div>))
                    }                
                  </div>
                  <div style={{display: 'flex', alignItems: 'center'}}>
                    <div style={{margin: '0 10px', cursor: 'pointer'}} onClick={()=>movePrev()}>
                      <img src={leftArrow} alt="" />
                    </div>
                    <div style={{margin: '0 10px', cursor: 'pointer'}} onClick={()=>moveNext()}>
                      <img src={rightArrow} alt="" />
                    </div>
                </div> 
              </div>
              <div className="grid">
                  {/* @ts-ignore */}
                  {data?.response.channels.map((channel, channelIdx)=>{
                    return <div style={{display: 'flex', height: '96px', flex: 'none', width: 'auto', marginLeft: '160px', background: '#1a1a1a'}} >
                      {
                        channel.events.map((eventTV: any, idx: number) => {
                        if(idx === 0){
                          return <div onMouseOver={()=>updateDescription(channelIdx, idx)} style={{color: '#e3e3e3', padding: '8px', border: '1px rgb(104 104 104) solid', flex:'none', width: `${getHours(0, new Date(eventTV.date_end)) * 130 * 2}px` }}>
                            <div style={{fontSize: '14px', }}>{eventTV.name}</div>
                            <div style={{marginTop: '5px', fontSize: '12px'}}>
                              {
                                `${new Date(eventTV.date_begin).getHours()} : ${new Date(eventTV.date_begin).getMinutes()} - ${new Date(eventTV.date_end).getHours()} : ${new Date(eventTV.date_end).getMinutes()}` 
                              }
                            </div>
                          </div>
                        }else{
                          return <div onMouseOver={()=>updateDescription(channelIdx, idx)} style={{ fontSize: '14px', color: '#e3e3e3', padding: '8px', border: '1px rgb(104 104 104) solid', flex:'none', width: `${getHours(new Date(eventTV.date_begin), new Date(eventTV.date_end)) * 130 * 2}px` }}>
                            <div style={{fontSize: '14px', }}>{eventTV.name}</div>
                            <div style={{marginTop: '5px', fontSize: '12px'}}>
                              {
                                `${new Date(eventTV.date_begin).getHours()} : ${new Date(eventTV.date_begin).getMinutes()} - ${new Date(eventTV.date_end).getHours()} : ${new Date(eventTV.date_end).getMinutes()}` 
                              }
                            </div>
                          </div>
                        }
                      })
                      }
                    </div>
                    })
                  }

                {/* <div style={{display: 'flex', height: '96px', flex: 'none', border: 'solid 2px green', width: '100%'}} >
                  <div style={{color: '#e3e3e3', padding: '8px', border: '1px red solid', flex:'none', width: `3000px` }}>
                    <div style={{fontSize: '14px', }}>Programa estelar</div>
                    <div style={{marginTop: '5px', fontSize: '12px'}}>
                      Hora de transmisión
                    </div>
                  </div>
                </div> */}
                <div className="channellist" style={{marginTop: `${(totalChannelsToDisplay * -130)+510}px`}}>
                  {/* @ts-ignore */}
                  {data?.response.channels.map((channel, channelIdx)=>(
                      <div className='logo'>
                        <img src={channel.image} height={80} alt=''/>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>
      }
    </div>
  );
}

export default App;
