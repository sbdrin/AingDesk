<template>
    <n-modal preset="card" :close-on-esc="false" :mask-closable="false" :closable="false" :title="$t('提示')"
        v-model:show="chatClearConfirm" class="w-400px">
        <span>{{ $t('是否删除所有对话?') }}</span>
        <template #footer>
            <div class="modal-footer-btns">
                <n-button @click="cancelCleanAllChats">{{ $t('取消') }}</n-button>
                <n-button @click="confirmCleanAllChats" type="primary">{{ $t('确认') }}</n-button>
            </div>
        </template>
    </n-modal>
</template>

<script setup lang="ts">
import { cancelCleanAllChats, confirmCleanAllChats } from "../controller"
import { getSiderStoreData } from '../store';
import { useI18n } from 'vue-i18n';
const { t: $t } = useI18n();
const { chatClearConfirm } = getSiderStoreData()
</script>

<style scoped></style>