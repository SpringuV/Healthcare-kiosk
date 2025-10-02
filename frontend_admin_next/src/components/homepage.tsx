'use client'

import { CrownOutlined } from "@ant-design/icons"
import { Result } from "antd"

const Home = () => {
    return (
        <div style={{ padding: 20 }}>
            <Result
                icon={<CrownOutlined />}
                title="Fullstack Next/Nest - createdBy @springUv"
            />
        </div>
    )
}

export default Home;