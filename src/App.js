import React, {Component} from 'react';
import {connect} from "react-redux";
import {Button, Panel} from "muicss/react";
import {CREATE_NODE} from "./constants/action-types";
import {OBJECT_TYPE} from "./constants/object-types";
import Start from "./opcomponent/start";
import End from "./opcomponent/end";
import Wheel from "./opcomponent/wheel";
import BranchDistSensor from "./opcomponent/branchdistsensor";
import Waitmsecs from "./opcomponent/waitmsecs";
import LineSensor from "./opcomponent/linesensor";
import Stop from "./opcomponent/stop";
import Readability from "./opcomponent/readability";

const panelStyle = {
    top: 10,
    width: "95vw",
    height: "85vh",
    position: "static",
    background: "#f0f0f0",
    border: "solid",
    padding: "10 16px",
    margin: "0 auto"
};

class App extends Component {
    constructor(props) {
        super(props);
    }

    renderGraph = () => {
        return Object.keys(this.props.graph).map(nodeId => {
            const node = this.props.graph[nodeId];
            let component = false;
            switch (node.type) {
                case OBJECT_TYPE.START:
                    component = <Start />;
                    break;
                case OBJECT_TYPE.END:
                    component = <End />;
                    break;
                case OBJECT_TYPE.WHEEL:
                    component = <Wheel />;
                    break;
                case OBJECT_TYPE.DISTANCE:
                    component = <BranchDistSensor />;
                    break;
                case OBJECT_TYPE.WAIT:
                    component = <Waitmsecs />;
                    break;
                case OBJECT_TYPE.LINE:
                    component = <LineSensor />;
                    break;
                case OBJECT_TYPE.STOP:
                    component = <Stop />;
                    break;
                case OBJECT_TYPE.READABILITY:
                    component = <Readability />;
                    break;
                default:
                    break;
            }
            return React.cloneElement(
                component,
                {
                    key: nodeId,
                }
            )
        })

        // todo: also render edges in this function
    };

    render() {
        return (
            <div>
                <Panel onMouseMove={this._onMouseMove.bind(this)} onMouseUp={() => {
                    this.setState({isMouseDown: false})
                }} style={panelStyle}>
                    <div style={{textAlign: "right"}}>
                        <Button color="primary" onClick={() => {
                            this.addComponent(OBJECT_TYPE.WHEEL);
                        }}>車を動かす
                        </Button>
                        <Button color="primary" onClick={() => {
                            this.addComponent(OBJECT_TYPE.WAIT);
                        }}>待つ
                        </Button>
                        <Button color="primary" onClick={() => {
                            this.addComponent(OBJECT_TYPE.DISTANCE);
                        }}>距離を測る
                        </Button>
                        <Button color="primary" onClick={() => {
                            this.addComponent(OBJECT_TYPE.LINE);
                        }}>明るさを測る
                        </Button>
                        <Button color="primary" onClick={() => {
                            this.addComponent(OBJECT_TYPE.STOP);
                        }}>車を止める
                        </Button>
                        <Button color="primary" onClick={() => {
                            this.addComponent(OBJECT_TYPE.READABILITY);
                        }}>見やすくする
                        </Button>
                    </div>
                    {this.renderEdges()}
                    {(() => {
                        if (this.state.isMouseDown) {
                            return (<Line x1={selectedcomppos[0]} y1={selectedcomppos[1]} id1={-1} x2={mouseX}
                                          y2={mouseY} id2={-1} thickness={1} color="black" />);
                        }
                    })()}
                    {this.renderOpComponents()}
                    <TrashBox ref='trashbox'/>
                </Panel>
                <div>
                    <div style={{ textAlign: "right" }}>
                        <Button color="primary" variant="fab" onClick={this.runProgram.bind(this)} disabled={this.state.isrunning}>実行</Button>
                        <Button color="danger" variant="fab" onClick={this.stopProgram.bind(this)}>やめる</Button>
                        <Button color="accent" variant="fab" onClick={() => {
                            this.connection = new WebSocket("ws:127.0.0.1:8000");
                        }}>再接続
                        </Button>
                    </div>
                </div>
                <div>{this.renderDebugWindow()}</div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const {graph} = state;
    return {graph}
};

const mapDispatchToProps = (dispatch) => {
    return {
        addComponent: (componentType) => dispatch({
            type: CREATE_NODE,
            payload: {
                nodeType: componentType
            }
        })
    };
};

export default connect(mapStateToProps, mapDispatchToProps())(App)