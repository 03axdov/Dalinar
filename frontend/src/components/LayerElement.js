import React, {useState, useEffect, useRef} from "react"
import {useNavigate} from "react-router-dom"
import axios from "axios"
import {LAYERS, WARNING_MESSAGES, VALID_PREV_LAYERS} from "../layers"

function LayerElement({layer, hoveredLayer, deleteLayer, 
                        BACKEND_URL, setLayers, layers, notification, 
                        prevLayer, setWarnings, provided, 
                        updateWarnings, idx, onMouseEnter, 
                        onMouseLeave, warnings=false, isPublic=false}) {

    const [type, setType] = useState(null)  // Workaround to stop warning when reordering layers.

    const [params, setParams] = useState({})

    const [updated, setUpdated] = useState(false)
    const [revertChanges, setRevertChanges] = useState(false)

    const [savingChanges, setSavingChanges] = useState(false)

    const [errorMessage, setErrorMessage] = useState("")

    const elementRef = useRef(null)

    useEffect(() => {
        
        let temp = {}
        Object.keys(LAYERS).forEach((key) => {
            let current_layer = LAYERS[key]
            for (let i=0; i < current_layer.params.length; i++) {
                let param = current_layer.params[i]
                temp[param.name] = layer[param.name]
            }
        })
        temp["input_x"] = layer.input_x || ""
        temp["input_y"] = layer.input_y || ""
        temp["input_z"] = layer.input_z || ""
        temp["activation_function"] = layer.activation_function || ""
        setParams(temp)

        setType(layer.layer_type)

    }, [layer, revertChanges])

    useEffect(() => {
        getErrorMessage()
    }, [updateWarnings])

    useEffect(() => {
        setUpdated(false)

        if (!type) {return}
        let current_layer = LAYERS[type]
        for (let i=0; i < current_layer.params.length; i++) {
            let param = current_layer.params[i]
            if (params[param.name] != layer[param.name]) {
                setUpdated(true)
            }
        }
        if (current_layer.dimensions) {
            for (let i=0; i < current_layer.dimensions.length; i++) {
                let dim = current_layer.dimensions[i]
                for (let j=0; j < dim.params.length; i++) {
                    let param = dim.params[j]
                    if (params[param.name] != layer[param.name]) {
                        setUpdated(true)
                    }
                }
            }
        }
        if (current_layer.activation_function && params["activation_function"] != (layer.activation_function || "")) {
            setUpdated(true)
        }
        if (current_layer.input_x && params["input_x"] != (layer.input_x || "")) {
            setUpdated(true)
        }
        if (current_layer.input_y && params["input_y"] != (layer.input_y || "")) {
            setUpdated(true)
        }
        if (current_layer.input_z && params["input_z"] != (layer.input_z || "")) {
            setUpdated(true)
        }

    }, [params])   // All layer states


    function checkInputDimensions(current_layer) {  // Adds dimensions, returns true if valid else false
        let numDims = 0
        if (current_layer.input_x) numDims += 1
        if (current_layer.input_y) numDims += 1
        if (current_layer.input_z) numDims += 1

        let notSpecifiedDims = numDims
        if (current_layer.input_x && params.input_x) notSpecifiedDims -= 1
        if (current_layer.input_y && params.input_y) notSpecifiedDims -= 1
        if (current_layer.input_z && params.input_z) notSpecifiedDims -= 1
        
        if (notSpecifiedDims == numDims || notSpecifiedDims == 0) {
            return true;
        } else {
            notification("You must either specify all input dimensions or none.", "failure")
            return
        }
    }

    function checkValidity() {
        let current_layer = LAYERS[type]
        for (let i=0; i < current_layer.params.length; i++) {
            let param = current_layer.params[i]
            if (param.validator) {
                let message = param.validator(params[param.name])
                if (message.length > 0) {
                    notification(message, "failure")
                    return
                } 
            }
        }
        if (current_layer.dimensions) {
            for (let i=0; i < current_layer.dimensions.length; i++) {
                let dim = current_layer.dimensions[j]
                for (let i=0; i < dim.params.length; i++) {
                    let param = dim.params[i]
                    if (param.validator) {
                        let message = param.validator(params[param.name])
                        if (message.length > 0) {
                            notification(message, "failure")
                            return
                        } 
                    }
                }
            }
        }
        if (current_layer.input_x || current_layer.input_y || current_layer.input_z) {
            return checkInputDimensions(current_layer);
        }

        return true;
    }

    function updateLayer(e) {

        let valid = checkValidity()
        if (!valid) {return}

        const data = {
            "id": layer.id,
            "type": layer.layer_type,
            "activation_function": params.activation_function
        }

        Object.keys(params).forEach((key) => {
            data[key] = params[key]
        })
        
        axios.defaults.withCredentials = true;
        axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
        axios.defaults.xsrfCookieName = 'csrftoken';    
        
        const URL = window.location.origin + '/api/edit-layer/'
        const config = {headers: {'Content-Type': 'application/json'}}

        if (savingChanges) {return}
        setSavingChanges(true)

        axios.post(URL, data, config)
        .then((res) => {
            
            
            let temp = [...layers]
            for (let i=0; i < temp.length; i++) {
                if (temp[i].id == layer.id) {
                    temp[i] = res.data
                }
            }
            setLayers(temp)

            notification("Successfully updated layer.", "success")
            setUpdated(false)

        }).catch((error) => {
            notification("Error: " + error + ".", "failure")
        }).finally(() => {
            setSavingChanges(false)
        })
    }

    function getErrorMessage() {
        setWarnings(false || warnings)

        let type = layer.layer_type
        let prevType = (prevLayer ? prevLayer.layer_type : null)
        setErrorMessage("")

        if (!VALID_PREV_LAYERS[type].includes(prevType)) {
            setWarnings(true)
            setErrorMessage(WARNING_MESSAGES[type])
        }

        if (!prevLayer && (!layer.input_x && !layer.input_y && !layer.input_z) && !LAYERS[type].no_dimensions) {
            setWarnings(true)
            setErrorMessage("Input dimensions must be specified on the first layer.")
        }

    }

    function dimensionsX(current_layer) {
        return (<div className="layer-element-stat">
            <span className={"layer-element-stat-color layer-element-stat-" + (current_layer.name == "Flatten" ? "pink" : "gray2")}></span>
            <label className="layer-element-label" htmlFor={"dimensionX" + layer.id}>Input width</label>
            {!isPublic && <input type="number" className="layer-element-input" id={"dimensionX" + layer.id} value={params.input_x} onChange={(e) => {
                let temp = {...params}
                temp["input_x"] = e.target.value
                setParams(temp)
            }}></input>}
            {isPublic && <div className="layer-element-input">{params.input_x || "-"}</div>}
        </div>)
    }

    function dimensionsY(current_layer) {
        return (<div className="layer-element-stat">
            <span className={"layer-element-stat-color layer-element-stat-" + (current_layer.name == "Flatten" ? "pink" : "gray2")}></span>
            <label className="layer-element-label" htmlFor={"dimensionY" + layer.id}>Input height</label>
            {!isPublic && <input type="number" className="layer-element-input" id={"dimensionY" + layer.id} value={params.input_y} onChange={(e) => {
                let temp = {...params}
                temp["input_y"] = e.target.value
                setParams(temp)
            }}></input>}
            {isPublic && <div className="layer-element-input">{params.input_y || "-"}</div>}
        </div>)
    }

    function dimensionsZ(current_layer) {
        return (<div className="layer-element-stat">
            <span className={"layer-element-stat-color layer-element-stat-" + (current_layer.name == "Flatten" ? "pink" : "gray2")}></span>
            <label className="layer-element-label" htmlFor={"dimensionX" + layer.id}>Input depth</label>
            {!isPublic && <input type="number" className="layer-element-input" id={"dimensionZ" + layer.id} value={params.input_z} onChange={(e) => {
                let temp = {...params}
                temp["input_z"] = e.target.value
                setParams(temp)
            }}></input>}
            {isPublic && <div className="layer-element-input">{params.input_z || "-"}</div>}
        </div>)
    }


    function getLayerElement(type) {
        let current_layer = LAYERS[type]
        let dimensionParams = []
        let current_dims = (current_layer.dimensions || [])
        for (let i=0; i < current_dims.length; i++) {
            let dim = current_dims[i]
            for (let j=0; j < dim.params.length; j++) {
                dimensionParams.push(dim.params[j])
            }
        }

        return (
            <form className="layer-element-inner">
                <h1 className="layer-element-title">
                    <img className="layer-element-title-icon" src={BACKEND_URL + "/static/images/" + current_layer.image} />
                    <span className="layer-element-title-text" title={current_layer.name}>{current_layer.name}</span>
                    {!isPublic && <img className="layer-element-drag" title="Reorder layer" src={BACKEND_URL + "/static/images/drag.svg"} {...provided.dragHandleProps} />}
                    {!isPublic && <img className="layer-element-delete" title="Delete layer" src={BACKEND_URL + "/static/images/cross.svg"} onClick={() => {
                        deleteLayer(layer.id)
                    }}/>}
                </h1>
                {current_layer.params.map((param, idx) => (
                    <div className="layer-element-stat" key={idx}>
                        <span className={"layer-element-stat-color layer-element-stat-" + current_layer.color}></span>
                        <label className="layer-element-label" htmlFor={param.name + layer.id}>{param.name_readable}</label>
                        {!isPublic && <input type={param.type} className="layer-element-input" id={param.name + layer.id} value={params[param.name]} onChange={(e) => {
                            let temp = {...params}
                            temp[param.name] = e.target.value
                            setParams(temp)
                        }}></input>}
                        {isPublic && <div className="layer-element-input">{params[param.name]}</div>}
                    </div>
                ))}
                {dimensionParams.map((param, idx) => (
                    <div className="layer-element-stat" key={idx}>
                        <span className={"layer-element-stat-color layer-element-stat-" + current_layer.color}></span>
                        <label className="layer-element-label" htmlFor={param.name + layer.id}>{param.name_readable}</label>
                        {!isPublic && <input type={param.type} className="layer-element-input" id={param.name + layer.id} value={params[param.name]} onChange={(e) => {
                            let temp = {...params}
                            temp[param.name] = e.target.value
                            setParams(temp)
                        }}></input>}
                        {isPublic && <div className="layer-element-input">{params[param.name]}</div>}
                    </div>
                ))}
                {current_layer.input_x && dimensionsX(current_layer)}
                {current_layer.input_y && dimensionsY(current_layer)}
                {current_layer.input_z && dimensionsZ(current_layer)}
                {current_layer.activation_function && <div className="layer-element-stat layer-element-activation">
                    <span className="layer-element-stat-color layer-element-stat-gray"></span>
                    <label className="layer-element-label" htmlFor={"activation" + layer.id}>Activation function</label>
                    {!isPublic && <select className="layer-element-input layer-element-activation-input" id={"activation" + layer.id} value={params["activation_function"]} onChange={(e) => {
                            let temp = {...params}
                            temp["activation_function"] = e.target.value
                            setParams(temp)
                        }}>
                            <option value="">-</option>
                            <option value="relu">ReLU</option>
                            <option value="softmax">Softmax</option>
                            <option value="sigmoid">Sigmoid</option>
                    </select>}
                    {isPublic && <div className="layer-element-input layer-element-activation-input">{params["activation_function"] || "-"}</div>}
                </div>}
            </form>
        )
    }

    function isEmptyObject(obj) {
        return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
    }
    
    if (type) {
        return (<div className="layer-element-outer" 
            {...provided.draggableProps}
            style={{...provided.draggableProps.style}}
            ref={provided.innerRef}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}>
    
                {type && layer && <div className={"layer-element " + (hoveredLayer == layer.id ? "layer-element-hovered" : "")} ref={elementRef}>
    
                    {errorMessage && <p className="layer-element-warning">
                        <img className="layer-element-warning-icon" src={BACKEND_URL + "/static/images/failure.png"} />
                        <span className="layer-element-warning-text">{errorMessage}</span>
                    </p>}
    
                    {!isEmptyObject(params) && getLayerElement(type)}
    
                    {!isPublic && <button type="button" 
                        className={"layer-element-save " + (!updated ? "layer-element-save-disabled" : "")}
                        title={(updated ? "Save changes" : "No changes")}
                        onClick={updateLayer}>
                        {savingChanges && <img className="create-dataset-loading" src={BACKEND_URL + "/static/images/loading.gif"}/>}
                        {(!savingChanges ? "Save changes" : "Updating...")}
                    </button>}
                    {!isPublic && <button type="button" 
                        className="layer-element-revert"
                        title="Revert changes"
                        onClick={() => setRevertChanges(!revertChanges)}>
                        Revert changes
                    </button>}

                    <div className="layer-element-index" title={"Layer #" + (idx+1)}>{idx+1}</div>
                </div>}

                
    
                
        </div>)

    } else {    // Avoids warnings
        return (<div {...provided.draggableProps}
            style={{...provided.draggableProps.style}}
            ref={provided.innerRef}
            {...provided.dragHandleProps}></div>)
    }
    
}


export default LayerElement