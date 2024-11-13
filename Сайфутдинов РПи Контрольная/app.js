class Trip {
  constructor(destination, date, notes) {
    this.destination = destination;
    this.date = date;
    this.notes = notes;
  }
}

class Trips {
  constructor() {
    this.trips = [];
  }

  addTrip(trip) {
    this.trips.push(trip);
  }

  getTrips() {
    return this.trips;
  }

  removeTrip(index) {
    this.trips.splice(index, 1);
  }

  editTrip(index, newTrip) {
    this.trips[index] = newTrip;
  }

  filterTripsByDate(startDate, endDate) {
    return this.trips.filter(trip => {
      const tripDate = new Date(trip.date);
      return tripDate >= startDate && tripDate <= endDate;
    });
  }
}

const trips = new Trips();

// Получение элементов DOM
const tripForm = document.getElementById('trip-form');
const tripList = document.getElementById('trip-list');

// Обработка отправки формы
tripForm.addEventListener('submit', (event) => {
  event.preventDefault();

  // Получение данных из формы
  const destination = document.getElementById('trip-destination').value;
  const date = document.getElementById('trip-date').value;
  const notes = document.getElementById('trip-notes').value;

  // Создание нового объекта Trip
  const newTrip = new Trip(destination, date, notes);

  // Добавление поездки в список
  trips.addTrip(newTrip);

  // Обновление представления
  renderTrips();

  // Очистка формы
  tripForm.reset();
});

// Функция для отрисовки списка поездок
function renderTrips() {
  tripList.innerHTML = ''; // Очищаем список

  // Отображение списка поездок
  trips.getTrips().forEach((trip, index) => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
      <span>${trip.destination}</span>
      <span>${trip.date}</span>
      <span>${trip.notes}</span>
      <button class="edit-button">Редактировать</button>
      <button class="delete-button">Удалить</button>
    `;
    tripList.appendChild(listItem);

    // Обработка события редактирования поездки
    const editButton = listItem.querySelector('.edit-button');
    editButton.addEventListener('click', () => {
      // Создание формы для редактирования
      const editForm = document.createElement('form');
      editForm.classList.add('edit-form');
      editForm.innerHTML = `
        <label for="edit-destination">Место назначения:</label>
        <input type="text" id="edit-destination" value="${trip.destination}" required />
        <label for="edit-date">Дата:</label>
        <input type="date" id="edit-date" value="${trip.date}" required />
        <label for="edit-notes">Заметки:</label>
        <textarea id="edit-notes" placeholder="Notes" rows="3">${trip.notes}</textarea>
        <button type="submit">Сохранить</button>
      `;

      // Добавление формы на страницу
      listItem.appendChild(editForm);

      // Обработка отправки формы
      editForm.addEventListener('submit', (event) => {
        event.preventDefault();

        // Получение данных из формы
        const newDestination = document.getElementById('edit-destination').value;
        const newDate = document.getElementById('edit-date').value;
        const newNotes = document.getElementById('edit-notes').value;

        // Создание нового объекта Trip
        const newTrip = new Trip(newDestination, newDate, newNotes);

        // Обновление поездки в списке
        trips.editTrip(index, newTrip);

        // Обновление представления
        renderTrips();

        // Удаление формы
        editForm.remove();
      });
    });
  });
}

// Фильтр по дате
const startDateInput = document.createElement('input');
startDateInput.setAttribute('type', 'date');
const endDateInput = document.createElement('input');
endDateInput.setAttribute('type', 'date');
const filterButton = document.createElement('button');
filterButton.textContent = 'Фильтровать';

// Добавление элементов фильтра на страницу
const filterDiv = document.createElement('div');
filterDiv.classList.add('trip-filter');
filterDiv.innerHTML = '<h2>Фильтровать поездки</h2>';
filterDiv.appendChild(startDateInput);
filterDiv.appendChild(endDateInput);
filterDiv.appendChild(filterButton);
document.body.appendChild(filterDiv);

// Обработка события фильтрации
filterButton.addEventListener('click', () => {
  const startDate = new Date(startDateInput.value);
  const endDate = new Date(endDateInput.value);

  // Фильтруем поездки
  const filteredTrips = trips.filterTripsByDate(startDate, endDate);

  // Отображаем отфильтрованный список
  renderTrips();
});

// Обработка события удаления поездки
tripList.addEventListener('click', (event) => {
  if (event.target.tagName === 'BUTTON' && event.target.textContent === 'Удалить') {
    const listItem = event.target.parentElement;
    const index = Array.from(tripList.children).indexOf(listItem); // Находим индекс удаляемой поездки

    // Удаляем поездку из списка
    trips.removeTrip(index);

    // Обновляем представление
    renderTrips();
  }
});

// Первоначальное отображение списка поездок
renderTrips();