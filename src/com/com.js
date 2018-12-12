export function withState(initState) {
    return function (Component) {
        return class HOC extends React.Component {
            constructor(props) {
                super(props);
                this.state = initState;
                this.setCompDidMount = fn => {
                    this.compDidMount = fn;
                }
            }

            componentDidMount() {
                this.compDidMount();
            }

            render() {
                return <Component {...this.props}
                    state={this.state}
                    setState={this.setState.bind(this)}
                    setCompDidMount={this.setCompDidMount.bind(this)}
                />
            }
        }
    }
}
