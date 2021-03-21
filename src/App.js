import axios from 'axios';
import React, { useState, useEffect } from "react";
import {
  Container,
  Header,
  Menu,
  Button,
  List,
  Image
} from "semantic-ui-react";
// import Menu from './components/Menu';

const URL="http://localhost:3000/books";

const App = () => {
  const [booksList, setBooksList] = useState([]);
  const [selected, setSelected] = useState({
    id: null,
    title: '',
    description: '',
    img_url: '',
    users: []
  });

  useEffect(() => {
    const getBooks = async () => {
      const res = await axios.get(URL);
      setBooksList(res.data);
      setSelected(res.data[0]);
    };
    getBooks();
  }, []);

  const renderBooks = books => {
    return books.map(b => {
      return (
        <Menu.Item key={b.id} onClick={() => setSelected(b)}>
          {b.title}
        </Menu.Item>
      );
    });
  };

  const renderUsers = users => {
    if (users) {
      return users.map(u => {
        return (
          <List.Item key={u.id} icon="user" content={u.username} />
        );
      });
    }
  }

  const onLikeClick = async () => {
    const pouros = selected.users.find(u => u.username === 'pouros');
    if (!pouros) {
      const res = await axios.patch(`${URL}/${selected.id}`, {
        users: [...selected.users, {
          id: 1,
          username: 'pouros'
        }]
      });
      setSelected(res.data);
    } else {
      const updateArr = selected.users.slice();
      updateArr.splice(updateArr.indexOf(pouros), 1);
      const res = await axios.patch(`${URL}/${selected.id}`, {
        users: [...updateArr]
      });
      setSelected(res.data);
    }
  }

  return (
    <div>
      <Menu inverted>
        <Menu.Item header>Bookliker</Menu.Item>
      </Menu>
      <main>
        <Menu vertical inverted>
          {renderBooks(booksList)}
          {/* <Menu.Item as={"a"} onClick={e => console.log("book clicked!")}>
            Book title
          </Menu.Item> */}
        </Menu>
        <Container text>
          <Header>{selected.title}</Header>
          <Image
            src={selected.img_url}
            size="small"
          />
          <p>{selected.description}</p>
          <Button
            color="red"
            content="Like"
            icon="heart"
            onClick={onLikeClick}
            label={{
              basic: true,
              color: "red",
              pointing: "left",
              content: `${selected.users.length}`
            }}
          />
          <Header>Liked by</Header>
          <List>
            {renderUsers(selected.users)}
            {/* <List.Item icon="user" content="User name" /> */}
          </List>
        </Container>
      </main>
    </div>
  );
}

export default App;
