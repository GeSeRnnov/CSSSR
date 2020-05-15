# CSSSR
Тестовое задание.
Комментарии к выполнению: 
1.Нужно привызывать функции к текущему контексту с помощью bind (handleStart и handleStop в TimerComponent, changeInterval в IntervalComponent, handleChange в WrappedComponent) 
2.mapDispatchToProps и mapStateToProps перепутаны местами в connect при вызове задании Interval
3. componentDidUpdate заменить на componentDidMount в WrappedComponent
4. добавить в локальный стейт TimerComponent идентификатор интервала
5. Заменить setTimeout на setInterval в handleStart (в TimerComponent) и записать данный идентификатор интервала в локальный стейт.
6. Домножить this.props.currentInterval на 1000 в handleStart (в TimerComponent)
7. В handleStop (в TimerComponent) добавить очистку интервала 
