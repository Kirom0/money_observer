import React from 'react';
import { TestAppContext } from './TestAppContext';

const TestAppContextValue = {
  modal: {
    addElement: undefined,
  }
}
export class TestApp extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      act: false,
      elements: [],
    }
    TestAppContextValue.modal.addElement = (element) => {
      this.setState((prevState) => {
        return {act: true, elements: [...prevState.elements, element]};
      })
    }
  }

  render() {
    return (
      <TestAppContext.Provider value={TestAppContextValue}>
        <Btn1/>
        {
          this.state.act && this.state.elements.map((el, idx) => (
            <React.Fragment key={idx}>{el}</React.Fragment>
          ))
        }
      </TestAppContext.Provider>
    );
  }
}

class Btn1 extends React.Component<any, any>{
  static contextType = TestAppContext;
  render() {
    return (
      <button
        onClick={()=>{
          this.context.modal.addElement(<Btn2/>)
        }}
      >Add element1</button>
    )
  }
}

class Btn2 extends React.Component<any, any>{
  static contextType = TestAppContext;
  render() {
    return (
      <button
        onClick={()=>{
          this.context.modal.addElement(<Btn1/>)
        }}
      >Add element2</button>
    )
  }
}
