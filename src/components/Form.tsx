import { Dispatch, useEffect, useState } from "react"
import { categories } from "../data/categories"
import { Activity } from "../../public/types"
import { ActivityActions, ActivityState } from "../reducers/activity-reducer"

import {v4 as uuidv4} from 'uuid'

type FormProps = {
    dispatch: Dispatch<ActivityActions>,
    state: ActivityState

}

export default function Form({dispatch, state}: FormProps) {
    const [activity, setActivity] = useState<Activity>({
        id: uuidv4(),
        category: 1,
        name: '',
        calories: 0
    })

    useEffect(()=> {
        if(state.activeId) {
            const activity = state.activities.find(activity => activity.id === state.activeId)
            if(activity) {
                setActivity(activity)
            }
        }
    }, [state.activeId])

    const handleChange = (e:React.ChangeEvent<HTMLSelectElement> |  React.ChangeEvent<HTMLInputElement> ) => {

        const isNumberField = ['category','calories'].includes(e.target.id)

        setActivity({
           
            ...activity,
            [e.target.id]: isNumberField ? +e.target.value: e.target.value,
            id: uuidv4()
        })
    }

    const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        dispatch({
            type: "save-activity",
            payload: {newActivity: activity}
        })

        setActivity({
            id: uuidv4(),
            category: 1,
            name: '',
            calories: 0
        })

    }

    const isValidActivity = () => {
        const {name, calories} = activity
        return name.trim() !== '' && calories > 0

    }

  return (
    <form 
        className="space-y-5 bg-white shadow p-10 rounded-lg"
        onSubmit={handleSubmit}
    >
        <div className="grid grid-cols-1 gap-3">
            <label htmlFor="category" className="font-bold">Categoria:</label>
            <select 
            className="border border-slate-300 p-2 rounder-lg w-full bg-white"
            id="category"
            value={activity.category}
            onChange={handleChange}

            >

            {categories.map(category => (
                <option 
                key={category.id} 
                value={category.id}

                >{category.name}
                </option>
            ))}
            </select>
        </div>

        <div className="grid gripd-cols-1 gap-3">
            <label htmlFor="name" className="font-bold"> Actividad: </label>
            <input
                id="name"
                type="text"
                className="border border-slate-300 p-2 rounder-lg"
                placeholder="Ej. Pasear al perro, ensalada, etc."
                value={activity.name}
                onChange={handleChange}
            />
        
        </div>

        <div className="grid gripd-cols-1 gap-3">
            <label htmlFor="calories" className="font-bold"> Calorias: </label>
            <input
                id="calories"
                type="number"
                className="border border-slate-300 p-2 rounder-lg"
                placeholder="Calorias. Ej. 100, 200, etc."
                value={activity.calories}
                onChange={handleChange}
            />
        
        </div>

        <input type="submit"
            className="bg-gray-800 hover:bg-gray-900 w-full p-2 font-bold uppercase text-white cursor-pointer disabled:opacity-10"
            value={activity.category === 1 ? 'Guardar Comida' : 'Guardar Ejercicio'}
            disabled={!isValidActivity()}
        />

        


    </form>
  )
}
