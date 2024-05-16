import React from 'react';
import { Provider } from 'react-redux';
import store from './store';
import UserManagement from './features/user/UserManagement';

function App() {
  return (
    <Provider store={store}>
      <UserManagement />
    </Provider>
  );
}

export default App;
