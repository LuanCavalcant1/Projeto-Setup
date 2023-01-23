import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { api } from "../lib/axios";
import { generateDatesfromYearBegining } from "../utils/generate-dates-from-year-begining.ts"
import { HabbitDay } from "./HabitDay"

const weekDays = [
    'D',
    'S',
    'T',
    'Q',
    'Q',
    'S',
    'S'
]

type Summary = {
    id: string
    date: string
    amount: number
    completed: number
}[]

const summaryDates = generateDatesfromYearBegining();

const miniumSummaryDatesSize = 18 * 7
const amountOfDaysTofill = miniumSummaryDatesSize - summaryDates.length


export const SummaryTable = () => {
    const [summary, setSummary] = useState<Summary>([])
    
    useEffect(()=>{
        api.get('/summary').then(response => {
            setSummary(response.data)
        })
    },[])

    return (
        <div className="w-full flex">
            <div className="grid grid-rows-7 grid-flow-row gap-3">
                {weekDays.map((weekDay, i) => {
                    return (
                        <div
                            key={`${weekDay}-${i} `}
                            className="text-zinc-400 text-xl h-10 w-10 font-bold flex items-center justify-center"
                        >
                            {weekDay}
                        </div>
                    )
                })}
            </div>
            <div className="grid grid-rows-7 grid-flow-col gap-3">
                {summary.length > 0 && summaryDates.map(date => {
                    const dayInSummary = summary.find(day => {
                        return dayjs(date).isSame(day.date, 'day')
                    })


                    return (<HabbitDay
                        key={date.toString()}
                        date={date}
                        amount={dayInSummary?.amount}
                        defaultCompleted={dayInSummary?.completed}
                    />
                    )
                })}
                {amountOfDaysTofill > 0 && Array.from({ length: amountOfDaysTofill }).map((_, i) => {
                    return (
                        <div
                            key={i}
                            className='w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg opacity-40 cursor-not-allowed'
                        />
                    )
                })}
            </div>
        </div>
    )
}