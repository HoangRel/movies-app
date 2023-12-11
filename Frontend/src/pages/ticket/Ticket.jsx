import React, { useEffect, useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
// import DatePicker from 'react-datepicker';
import { format } from 'date-fns';

// import 'react-datepicker/dist/react-datepicker.css';
import styles from './Ticket.module.css';

const Booking = props => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [bookedSeat, setBookedSeat] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState([]);

  const token = localStorage.getItem('token');

  const fellTicketHandler = async (id, date) => {
    const res = await fetch(
      `http://localhost:8080/ticket/get?id=${id}&date=${date}`,
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      setBookedSeat(
        Array(48)
          .fill(null)
          .map((_, i) => (i + 1).toString().padStart(2, 0))
      );

      return window.alert(data.message);
      //
    }

    setBookedSeat(data);
    return;
  };

  console.log(bookedSeat);

  const postBookingHandler = async data => {
    try {
      const res = await fetch('http://localhost:8080/ticket/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        return window.alert('Booking failed. Please try again.');
      }

      const resData = await res.json();

      onCancelHandler();
      return window.alert(resData.message);
    } catch (err) {
      console.error(err);
      return window.alert(
        'An unexpected error occurred. Please try again later.'
      );
    }
  };

  const { movieId } = props;

  useEffect(() => {
    if (movieId && selectedDate) {
      fellTicketHandler(movieId, format(selectedDate, 'dd/MM/yyyy'));
    }
  }, [movieId, selectedDate]);

  useEffect(() => {
    setSelectedSeat([]);
  }, [selectedDate]);

  const currentDate = new Date();

  const dateOptions = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(currentDate);
    date.setDate(currentDate.getDate() + index);
    return date;
  });

  const onSelectedDateHandler = date => {
    setSelectedDate(date);
  };

  const onSelectedSeatHandler = event => {
    if (event.target.tagName === 'LI') {
      const seat = event.target.innerText;

      const isSeatBooked = bookedSeat.includes(seat);

      const isSeatSelected = selectedSeat.includes(seat);

      if (isSeatBooked) {
        return;
      }

      setSelectedSeat(prev => {
        if (isSeatSelected) {
          return prev.filter(selected => selected !== seat);
        } else {
          return [...prev, seat];
        }
      });
    }
  };

  const onCancelHandler = () => {
    console.log('cancel');
    setSelectedSeat([]);
    setSelectedDate(null);
    props.onClose();
  };

  const onCloseHandler = event => {
    if (event.target.tagName === 'SECTION') {
      onCancelHandler();
    }
  };

  const onSubmitHandler = event => {
    event.preventDefault();
    console.log('submit');
    // console.log(format(selectedDate, 'dd/MM/yyyy'), selectedSeat);
    const movieId = props.movieId;
    const date = format(selectedDate, 'dd/MM/yyyy');

    console.log(movieId, date, selectedSeat);

    postBookingHandler({ movieId, date, seat: selectedSeat });
  };

  // const seatClass = innerText =>
  //   selectedSeat.includes(innerText) ? styles['num'] : '';

  const seatClass = innerText => {
    if (bookedSeat.includes(innerText)) {
      return styles['booked'];
    }
    return selectedSeat.includes(innerText) ? styles['num'] : '';
  };

  return (
    <section className={styles.session} onClick={onCloseHandler}>
      <div>
        <ul>
          {dateOptions.map((date, index) => (
            <li
              key={index}
              className={
                selectedDate &&
                date &&
                selectedDate.getDate() === date.getDate()
                  ? styles['selected']
                  : ''
              }
              onClick={() => onSelectedDateHandler(date)}
            >
              <div className={styles['date']}>
                <strong>{date.getDate().toString().padStart(2, '0')}</strong>
                <span>{date.getMonth() + 1}</span>
                <span>
                  {(() => {
                    switch (date.getDay()) {
                      case 0:
                        return <p>Sun</p>;
                      case 1:
                        return <p>Mon</p>;
                      case 2:
                        return <p>Tue</p>;
                      case 3:
                        return <p>Wed</p>;
                      case 4:
                        return <p>Thu</p>;
                      case 5:
                        return <p>Fri</p>;
                      case 6:
                        return <p>Sat</p>;
                      default:
                        return null;
                    }
                  })()}
                </span>
              </div>
            </li>
          ))}
        </ul>
        {selectedDate && (
          <>
            <div className={styles.seats} onClick={onSelectedSeatHandler}>
              <ul>
                <li className={seatClass('01')}>01</li>
                <li className={seatClass('02')}>02</li>
                <li className={seatClass('03')}>03</li>
                <li className={seatClass('04')}>04</li>
                <li className={seatClass('05')}>05</li>
                <li className={seatClass('06')}>06</li>
                <li className={seatClass('07')}>07</li>
                <li className={seatClass('08')}>08</li>
              </ul>
              <ul>
                <li className={seatClass('09')}>09</li>
                <li className={seatClass('10')}>10</li>
                <li className={seatClass('11')}>11</li>
                <li className={seatClass('12')}>12</li>
                <li className={seatClass('13')}>13</li>
                <li className={seatClass('14')}>14</li>
                <li className={seatClass('15')}>15</li>
                <li className={seatClass('16')}>16</li>
              </ul>
              <ul>
                <li className={seatClass('17')}>17</li>
                <li className={seatClass('18')}>18</li>
                <li className={seatClass('19')}>19</li>
                <li className={seatClass('20')}>20</li>
                <li className={seatClass('21')}>21</li>
                <li className={seatClass('22')}>22</li>
                <li className={seatClass('23')}>23</li>
                <li className={seatClass('24')}>24</li>
              </ul>
              <ul>
                <li className={seatClass('25')}>25</li>
                <li className={seatClass('26')}>26</li>
                <li className={seatClass('27')}>27</li>
                <li className={seatClass('28')}>28</li>
                <li className={seatClass('29')}>29</li>
                <li className={seatClass('30')}>30</li>
                <li className={seatClass('31')}>31</li>
                <li className={seatClass('32')}>32</li>
              </ul>
              <ul>
                <li className={seatClass('33')}>33</li>
                <li className={seatClass('34')}>34</li>
                <li className={seatClass('35')}>35</li>
                <li className={seatClass('36')}>36</li>
                <li className={seatClass('37')}>37</li>
                <li className={seatClass('38')}>38</li>
                <li className={seatClass('39')}>39</li>
                <li className={seatClass('40')}>40</li>
              </ul>
              <ul>
                <li className={seatClass('41')}>41</li>
                <li className={seatClass('42')}>42</li>
                <li className={seatClass('43')}>43</li>
                <li className={seatClass('44')}>44</li>
                <li className={seatClass('45')}>45</li>
                <li className={seatClass('46')}>46</li>
                <li className={seatClass('47')}>47</li>
                <li className={seatClass('48')}>48</li>
              </ul>
            </div>
            <form className={styles.button}>
              <button type='button' onClick={onCancelHandler}>
                Cancel
              </button>
              <button type='submit' onClick={onSubmitHandler}>
                Submit
              </button>
            </form>
          </>
        )}
      </div>
    </section>
  );
};

const Ticket = props => {
  return (
    <>
      {ReactDOM.createPortal(
        <Booking movieId={props.movieId} onClose={props.onClose} />,
        document.getElementById('ticket')
      )}
    </>
  );
};

export default Ticket;
