import React, { Component } from 'react'
import Creatable from 'react-select/creatable'

export class PrivateFor extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {options: [], selection: []}
    }

    render() {
        const {options, selection} = this.state;
        return <Creatable options={options} className="private_for"
                       onChange={this.onChangeInternal}
                       value={selection}
                       classNamePrefix="private_for" isMulti autosize={false}/>;
    }

    onChangeInternal = (options) => {
        this.setState({selection: options})
        this.sendOptionsToParent(options);
    };

    componentDidMount() {
        const {initialPrivateFor} = this.props;
        let _this = this;
        Client.post('api/node/tm/peers')
        .then((response) => {
            const parties = response.data.attributes.result.keys;
            _this.setOptionsAndsSelection(parties, initialPrivateFor);
        })
    }

    setOptionsAndsSelection = (parties, initialPrivateFor) => {
        const options = parties
            .map(party => this.createOption(party))
            .sort((a, b) => a.label.localeCompare(b.label));

        const initialSelection = options.filter(
            option => initialPrivateFor.indexOf(option.value) >= 0);

        this.setState({options, selection: initialSelection});

        console.log("initial", options, initialSelection)
        // setting initial selection through state won't tigger onChange
        this.sendOptionsToParent(initialSelection);
    };

    createOption(party) {
        return {
            value: party.key,
            label: party.key // default to just the key
        };
    }

    sendOptionsToParent(options) {
        this.props.onChange(options ? options.map(option => option.value) : []);
    }
}
