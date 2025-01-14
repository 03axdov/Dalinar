import React, {useState} from "react"
import {useNavigate} from "react-router-dom"

function DatasetElement({dataset}) {
    const formattedDate = new Date(dataset.created_at).toLocaleDateString("en-US")
    const navigate = useNavigate()

    function onClick() {
        const URL = window.location.origin + "/datasets/" + dataset.id
        var win = window.open(URL, '_blank');
        win.focus();
    }

    console.log(dataset)

    return (
        <div className="dataset-element" onClick={onClick} >
            <div className="dataset-element-header">
                
            {dataset.datatype == "classification" && <img title="Classfication" className="dataset-element-icon dataset-element-icon-type" src={window.location.origin + "/static/images/classification.png"}/>}
            {dataset.datatype == "area" && <img title="Area" className="dataset-element-icon dataset-element-icon-type" src={window.location.origin + "/static/images/area.svg"}/>}
            
            <p className="dataset-element-name">{dataset.name}</p>

            <img title="Edit dataset" className="dataset-element-icon dataset-element-options" src={window.location.origin + "/static/images/options.png"} onClick={(e) => {
                e.stopPropagation()

                navigate("/edit-dataset/" + dataset.id)
            }}/>
            </div>
            
            {dataset.image && <img className="dataset-element-image" src={dataset.image}/>}
            

            <p className="dataset-element-date">{formattedDate}</p>
            <p className="dataset-element-count">{dataset.elements.length + " element" + (dataset.elements.length != 1 ? "s" : "")}</p>


        </div>
    )
}


export default DatasetElement