import { View, Text, ScrollView,Alert } from "react-native"

import { api } from '../lib/axios'

import { generateRangeDatesfromYearStart } from '../utils/generate-dates-from-year-begining'
import { HabitDay, DAY_SIZE } from "../components/HabitDay"
import { Header } from "../components/Header"
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react"
import { Loading } from "../components/Loading"
import dayjs from "dayjs"

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const datesFromYearStart = generateRangeDatesfromYearStart();
const minimumSummaryDatesSize = 18 * 5;
const amountOfDaysToFIll = minimumSummaryDatesSize - datesFromYearStart.length;

type SummaryProps = {
    id: string
    date: string
    amount: number
    completed: number
}[]


export const Home = () => {
    const {navigate} = useNavigation();
    const [loading, setLoading] = useState(true)
    const [summary, setSummary] = useState<SummaryProps | null>(null)

    async function fetchData() {
        try{
            setLoading(true);
            const response = await api.get('/summary');
           
            setSummary(response.data)
        }catch (error) {
            Alert.alert('Ops', 'Não foi possivel carregar os hábitos')
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useFocusEffect(useCallback(()=>{
        fetchData();
    },[]))

    if (loading) {
        return (<Loading/>)
    }

    return (
        <View className="flex-1 bg-background px-8 pt-16">
            <Header />

            <View className="flex-row mt-6 mb-2">
                {
                    weekDays.map((weekDays, i) => (
                        <Text key={`${weekDays}-${i}`}
                            className='text-zinc-400 text-xl font-bold text-center mx-1'
                            style={{ width: DAY_SIZE }}
                        >
                            {weekDays}
                        </Text>
                    ))
                }
            </View>
                <ScrollView showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingBottom: 100}}>
                {
                summary && 
                    <View className="flex-row flex-wrap">
                {
                    datesFromYearStart.map(date => {

                        const dayWithHabits = summary.find(day => {
                            return dayjs(date).isSame(day.date,)
                        })

                        return (
                            <HabitDay
                            key={date.toISOString()}
                            date={date}
                            amountOfHabits={dayWithHabits?.amount}
                            amountCompleted={dayWithHabits?.completed}
                            onPress={()=> navigate('habito', {date: date.toISOString() })}
                        />
                        )
                    })
                }
                            {
                amountOfDaysToFIll > 0 && Array.from({ length: amountOfDaysToFIll }).map((_, i) => (
                    <View key={i}
                        className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
                        style={{ width: DAY_SIZE, height: DAY_SIZE }}
                    />
                ))
            }
            </View>
            }
                </ScrollView>

        </View>
    )
}