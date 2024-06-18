function TabBarDesign({ data, activeTab, onClick }) {
    return (
        <div style={{ padding: "0px 10px", display: "flex" }} >
            {
                data?.map((d) => {
                    return (
                        <div
                            onClick={() => onClick(d?.key)}
                            key={d?.key}
                            style={{
                                padding: "5px 0px 5px 0px",
                                marginRight: "15px",
                                borderBottom: activeTab === d?.key ? "3px solid #1F1F1F " : null, cursor: "pointer"
                            }}>
                            {d?.value}
                        </div>
                    )
                })
            }
        </div >
    )
}

export default TabBarDesign