import { NextPage } from "next"
import { useStore } from "store"

const Tag: NextPage = () => {
    const store = useStore()
    console.log(store?.user?.userInfo)
    return (<div>
        Tag
    </div>)
}

export default Tag
export { getServerSideProps } from 'help/getServerSideProps'