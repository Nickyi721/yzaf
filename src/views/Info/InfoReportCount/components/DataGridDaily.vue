<template>
    <el-table :data="data" height="100%" class="table" @selection-change="_TableSelectionChange" @row-dblclick="_TableDblClick">
        <el-table-column label="单位名称" prop="tcDwmc" align="center" ></el-table-column>
        <el-table-column label="已填报天数" prop="ytbts" align="center" ></el-table-column>
        <el-table-column label="应填报天数" prop="ztbts" align="center" ></el-table-column>
    </el-table>
</template>

<script>
import Mixin from '@mixins'
export default {
    mixins: [Mixin.Grid],
    data () {
        return{

        }
    },
    props: {
        data: {
            type: Array,
            default: () => []
        }
    },
}
</script>
