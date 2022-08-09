import { useEffect, useState } from "react"
import styles from './index.module.scss'

interface IProps {
    time: number
    onEnd: Function
}

const CountDown = ({ time = 60, onEnd }: IProps) => {

    const [count, setCount] = useState(time)
    useEffect(() => {
        const timer = setInterval(() => {
             setCount((count) => {
                if (count <= 1) {
                    clearInterval(timer)
                    onEnd && onEnd()
                    return count
                }
                return count - 1 
             })
        }, 1000)
        return () => {
            clearInterval(timer)
        }
    }, [time, onEnd])

    return (
        <div className={styles.coutnDown}>
            {count}
        </div>
    )
}

export default CountDown