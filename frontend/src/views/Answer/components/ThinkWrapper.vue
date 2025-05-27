<template>
    <div :class="['think-wrapper']" ref="wrapperRef" v-if="content.replace(/\s/g, '') ">
        <div class="has-thought">
            <span class="flex items-center gap-2.5 h-15">
                <i class="i-common:has-thought w-22 h-22"></i>{{ $t("已深度思考") }}
            </span>
            <span>
                <i class="i-common:arrow-up w-22 h-22 cursor-pointer" v-if="!isClose" @click="closeThink"></i>
                <i class="i-common:arrow-down w-22 h-22 cursor-pointer" v-else @click="openThink"></i>
            </span>
        </div>
        <div class="think-content" v-html="thinkContent"></div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch,computed } from 'vue';
import hljs from 'highlight.js';
import markdownit from 'markdown-it'
import { getSoftSettingsStoreData } from '@/views/SoftSettings/store';
const {
    themeColors,
    themeMode 
} = getSoftSettingsStoreData()
const props = defineProps<{ content: string }>()
const isClose = ref(false)
const wrapperRef = ref()
const thinkContent = ref("")
const md = markdownit({
    html: true,
    linkify: true,
    typographer: true,
    langPrefix: 'language-',
    highlight(str, lang): string {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(lang, str, true).value
            } catch (__) { }
        }

        return md.utils.escapeHtml(str);
    }
})

// 覆盖默认的链接渲染器，设置 target="_blank" 和 rel="noopener noreferrer"
const defaultRender = md.renderer.rules.link_open || function(tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
};

md.renderer.rules.link_open = function(tokens, idx, options, env, self) {
    // 为链接添加 target="_blank" 属性
    tokens[idx].attrPush(['target', '_blank']);
    
    // 添加安全相关属性，防止新页面对原页面的访问，增强安全性
    tokens[idx].attrPush(['rel', 'noopener noreferrer']);
    
    // 调用默认渲染
    return defaultRender(tokens, idx, options, env, self);
};

// md.use(mathJax3)
watch(() => props.content, () => {
    const res = md.render(props.content)  // 正文渲染时取消think部分
    thinkContent.value = res
}, { immediate: true })

// 关闭思考
function closeThink() {
    isClose.value = true
    wrapperRef.value.style.height = "30px"
}


// 打开思考
function openThink() {
    isClose.value = false
    wrapperRef.value.style.height = "auto"
}


/**
 * @description 根据主题计算当前应用的颜色模式
 */
 const themeThinkBg = computed(()=>{
    if(themeMode.value == "light"){
        return themeColors.value.thinkWrapperLight 
    }else{{
        return themeColors.value.thinlWrapperDark
    }}
})
</script>

<style scoped lang="scss">
.think-wrapper {
    margin-bottom: var(--bt-mg-normal);
    background-color: v-bind(themeThinkBg);
    padding: var(--bt-pd-normal);
    transition: max-height 0.5s ease;
    overflow: hidden;

    .has-thought {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--bt-mg-normal);

    }

    .think-content {
        line-height: 28px;
    }
}

.is-close {
    max-height: 30px;
}
</style>