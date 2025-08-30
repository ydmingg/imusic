<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
const props = defineProps(["height", "percentage"])
const emit = defineEmits(['update:percentage'])

// 当前音量百分比 (0-100)
const volume = ref(0) // 初始音量设为 30%¿
volume.value = props.percentage
// console.log(props.percentage);
const a = props.percentage

// 是否正在拖动
const isDragging = ref(false)
// 进度条容器的引用，用于获取其宽度和位置
const volumeBoxRef = ref<HTMLElement | null>(null)


// 根据音量百分比计算拖动按钮的样式00
const btnStyle = computed(() => {
    // 按钮宽度为12px，为了让按钮中心对准进度条末端，需要偏移半个按钮宽度 (6px)
    return {
        left: `calc(${volume.value}% - 6px)`
    }
})
const btnStyle1 = {
    "--btn-height": `${props.height > 4.6 ? 4.6 : props.height}px`,
    "--btn-after-width": `${props.height > 4.6 ? 4.6 + 2 : props.height + 1}px`
}



// 侦听props.percentage 的变化，更新 volume 的值
watch(() => props.percentage, (newVal) => {
    if (newVal) {
        volume.value = newVal
    }

})

// 鼠标在按钮上按下时触发
const handleMouseDown = (e: MouseEvent) => {
    // 阻止默认行为，例如拖动图片或选中文本
    e.preventDefault()

    isDragging.value = true
    // 在 document 上添加移动和抬起事件监听
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
}

// 鼠标在整个文档中移动时触发 (只有在 isDragging 为 true 时才处理)
const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.value) return
    if (!volumeBoxRef.value) return

    // 获取进度条容器的边界信息
    const rect = volumeBoxRef.value.getBoundingClientRect()
    // 计算鼠标在进度条内的水平位置 (e.clientX - rect.left)
    // offsetX 是相对于容器左边缘的偏移量
    let offsetX = e.clientX - rect.left

    // 边界处理：确保 offsetX 不会超出 [0, rect.width] 的范围
    if (offsetX < 0) {
        offsetX = 0
    }
    if (offsetX > rect.width) {
        offsetX = rect.width
    }

    // 将像素偏移量转换为百分比
    const newVolume = Math.round((offsetX / rect.width) * 100)
    volume.value = newVolume
    emit('update:percentage', newVolume)
}

// 鼠标在整个文档中抬起时触发
const handleMouseUp = () => {
    if (!isDragging.value) return

    isDragging.value = false
    // ★ 关键：移除 document 上的事件监听，避免内存泄漏和不必要的计算
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
}

// 在组件卸载时，确保事件监听器被移除，防止内存泄漏
onUnmounted(() => {
    // 这是一个兜底操作，以防万一在拖动过程中组件被卸载
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
})




</script>


<template>
    <div class="olume-box" ref="volumeBoxRef">
        <n-progress
            type="line"
            status="error"
            :percentage="volume"
            :height="height"
            :show-indicator="false"
            :color="{ stops: ['#E3F2FD', '#18a058'] }"
        />
        <div class="volume-btn" :style="[btnStyle1, btnStyle]" @mousedown="handleMouseDown"></div>
    </div>
</template>

<style scoped>
.olume-box {
    position: relative;
    width: 100%;
}

.volume-btn {
    background: #fff;
    border-radius: 50%;
    box-shadow: 0 0 15px 0 rgba(0, 0, 0, .15);
    width: calc(var(--btn-height) * 4);
    height: calc(var(--btn-height) * 4);
    position: absolute;
    /* right: calc(var(--btn-after-width)*0.9 * -1); */
    top: calc(var(--btn-after-width) *0.9 * -1);
    z-index: 100;
    cursor: pointer;
}

.volume-btn::after {
    content: "";
    background: #18a058;
    border-radius: 50%;
    width: var(--btn-after-width);
    height: var(--btn-after-width);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

}
</style>