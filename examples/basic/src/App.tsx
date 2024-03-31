import './App.css';
import '../../../../reactivity-hook-form/src/style.css';
import Form, { FormItem } from '../../../../reactivity-hook-form/src';

function App() {
  return (
    <div className="container">
      <Form>
        <FormItem
          name="username"
          label="Username"
          rules={{ required: 'User name is required' }}
        >
          <input type="text" placeholder="Username" />
        </FormItem>
        <FormItem
          name="password"
          label="Password"
          rules={{ required: 'Password is required' }}
        >
          <input type="password" placeholder="Password" />
        </FormItem>

        <button>Submit</button>
      </Form>
    </div>
  );
}

export default App;
