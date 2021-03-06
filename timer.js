// Slomux — упрощённая, сломанная реализация Flux.
// Перед вами небольшое приложение, написанное на React + Slomux.
// Это нерабочий секундомер с настройкой интервала обновления.

// Исправьте ошибки и потенциально проблемный код, почините приложение и прокомментируйте своё решение.

// При нажатии на "старт" должен запускаться секундомер и через заданный интервал времени увеличивать свое значение на значение интервала
// При нажатии на "стоп" секундомер должен останавливаться и сбрасывать свое значение

const createStore = (reducer, initialState = 1) => {
  let currentState = initialState
  const listeners = []

  const getState = () => currentState
  const dispatch = action => {
    currentState = reducer(currentState, action)
    listeners.forEach(listener => listener())
  }

  const subscribe = listener => listeners.push(listener)

  return { getState, dispatch, subscribe }
}

const connect = (mapStateToProps, mapDispatchToProps) =>
  Component => {
    class WrappedComponent extends React.Component {
      constructor(){
        super()
        this.handleChange=this.handleChange.bind(this)
      }
      render() {
        return (
          <Component
            {...this.props}
            {...mapStateToProps(this.context.store.getState(), this.props)}
            {...mapDispatchToProps(this.context.store.dispatch, this.props)}
          />
        )
      }

      componentDidMount() {        
        this.context.store.subscribe(this.handleChange);
      }

      handleChange() {
        this.forceUpdate()
      }
    }

    WrappedComponent.contextTypes = {
      store: PropTypes.object,
    }

    return WrappedComponent
  }

class Provider extends React.Component {
  getChildContext() {
    return {
      store: this.props.store,
    }
  }
  
  render() {
    return React.Children.only(this.props.children)
  }
}

Provider.childContextTypes = {
  store: PropTypes.object,
}

// APP

// actions
const CHANGE_INTERVAL = 'CHANGE_INTERVAL'

// action creators
const changeInterval = value => ({
  type: CHANGE_INTERVAL,
  payload: value,
})


// reducers
const reducer = (state, action) => {
  switch(action.type) {
    case CHANGE_INTERVAL:
      return state += action.payload;      
    default:
      return {}
  }
}

// components

class IntervalComponent extends React.Component {
  constructor(){
    super();
    this.decrement=this.decrement.bind(this);
    this.increment=this.increment.bind(this);
  }
  increment() {    
    this.props.changeInterval(1);
  }
  decrement() {    
      this.props.changeInterval(-1);
  }
  render() {
    return (
      <div>
        <span>Интервал обновления секундомера: {this.props.currentInterval} сек.</span>
        <span>
          <button onClick={this.decrement}>-</button>
          <button onClick={this.increment}>+</button>
        </span>
      </div>
    )
  }
}

const Interval = connect(state => ({
    currentInterval: state,
  }),
  dispatch => ({
    changeInterval: value => dispatch(changeInterval(value)),
  })
)(IntervalComponent)

class TimerComponent extends React.Component {
  state = {
    currentTime: 0,
    interval: '',
  }

  render() {
    
    return (
      <div>
        <Interval />
        <div>
          Секундомер: {this.state.currentTime} сек.
        </div>
        <div>
          <button onClick={this.handleStart.bind(this)}>Старт</button>
          <button onClick={this.handleStop.bind(this)}>Стоп</button>
        </div>
      </div>
    )
  }

  handleStart() { 
    const interval = setInterval(() => {
      const newTime = this.state.currentTime + this.props.currentInterval;
      this.setState({
        // currentTime: newTime,        
        currentTime: this.state.currentTime + this.props.currentInterval,
      })}, this.props.currentInterval*1000);
    
    this.setState({ currentTime: this.state.currentTime, interval: interval })
  }
  
  handleStop() {
    clearInterval(this.state.interval);
    this.setState({ currentTime: 0 });
  }
}

const Timer = connect(state => ({
  currentInterval: state,
}), () => {})(TimerComponent)

// init
ReactDOM.render(
  <Provider store={createStore(reducer)}>
    <Timer />
  </Provider>,
  document.getElementById('app')
)
