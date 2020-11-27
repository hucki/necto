import { EditOutlined } from "@ant-design/icons";
import React, { FormEvent, useState } from "react";

import { useAddUser, useAuth0User } from "../../hooks/user";

interface UserProfileProps {
  purpose?: string,
  a0Id: string,
};


const UserProfile = ({purpose = 'view', a0Id}: UserProfileProps):JSX.Element => {
  const [createUser ] = useAddUser();
  const [ state, setState ] = useState(purpose);
  const { user, isLoading } = useAuth0User(a0Id);
  const [ userState, setUserState ] = useState({
    a0Id: a0Id,
    firstName: user ? user.firstName : '',
    lastName: user ? user.lastName : '',
  });

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) : void => {
    e.preventDefault();
    setUserState(currentState => ({
        ...currentState,
        [e.target.name]: e.target.value
      }))
  }
  const onSubmitHandler = (e: FormEvent) : void => {
    e.preventDefault();
    state === 'new' ? createUser({user: userState}) : console.log('Update function coming later');
    toggleEdit(e);

  }
  const toggleEdit = (e: FormEvent) : void => {
    e.preventDefault();
    setState(currentState => currentState === 'view' ? 'edit' : 'view')
  }

  if (isLoading) return <div>fetching data</div>
  return (
    <div>
      <form onSubmit={onSubmitHandler}>
        <label htmlFor="firstName">First Name</label>
        <input disabled={state === 'view'} type="text" name="firstName" value={userState.firstName} onChange={onChangeHandler}/>
        <label htmlFor="lastName">Last Name</label>
        <input disabled={state === 'view'} type="text" name="lastName" value={userState.lastName} onChange={onChangeHandler}/>
        {state === 'view' ? <button onClick={toggleEdit}><EditOutlined /></button> : <button type="submit">{state === 'new' ? 'Create User' : 'Save changes'}</button>}
      </form>

    </div>
  );
};

export default UserProfile;