<template>
    <div class="choose-model-wrapper">
        <n-popover trigger="click" placement="bottom-start" v-model:show="modelListShow">
            <template #trigger>
                <div class="flex justify-start items-center gap-2.5 cursor-pointer" @click="modelListShow = true">
                    <span>{{ model ? model : $t('请选择模型') }}</span>
                    <div class="choosed-model-handle">
                        <i class="i-tdesign:chevron-down w-20 h-20"></i>
                    </div>
                </div>
            </template>
            <ModelList @chooseModel="handleChooseModel" />
        </n-popover>

        <i class="i-ci:add-plus w-16 h-16 cursor-pointer" @click="$emit('addModelChoose')" v-if="hasPlus"></i>

        <i class="i-ci:minus w-16 h-16 cursor-pointer" @click="$emit('removeModelChoose')" v-if="hasMinus"></i>
    </div>
</template>

<script setup lang="ts">
import ModelList from "./ModelList.vue";
const model = defineModel<string>({ default: "" })
const supplier = defineModel<string>("supplier", { default: "" })
withDefaults(defineProps<{ hasMinus?: boolean, hasPlus?: boolean }>(), {
    hasMinus: false,
    hasPlus: true
})
const emits = defineEmits(['addModelChoose', 'removeModelChoose'])

const modelListShow = ref(false)

function handleChooseModel(data: any) {
    modelListShow.value = false
    model.value = data.model
    supplier.value = data.option.supplierName
}
</script>

<style scoped lang="scss">
@use "@/assets/base.scss";

.choose-model-wrapper {
    @include base.row-flex-between;
    justify-content: flex-start;


    .choosed-model-handle {
        @include base.row-flex-between;
        gap: 0;
        cursor: pointer;
        justify-content: flex-start;
    }


}
</style>