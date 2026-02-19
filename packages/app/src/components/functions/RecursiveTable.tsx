import { Table, TableColumn } from "@backstage/core-components"
import { EntityData } from "./FunctionsPageNew2"


export const RecursiveTable = ({columns, children, all}: {
    columns: TableColumn<EntityData>[], 
    children: EntityData[],
    all: Map<String,EntityData[]>
}) => {
    console.log(children)
    return (
        <Table
        options={{ 
            paging: false,
            filtering: false,
            hideFilterIcons: true,
            header:false
         }}
        columns={columns}
        data={children}
        detailPanel={ row => (
          (row.rowData.ref? 
          <RecursiveTable columns={columns} children={all.get(row.rowData.ref) ?? []} all={all}/>:
          undefined
          )
        )}
        />
    )
}