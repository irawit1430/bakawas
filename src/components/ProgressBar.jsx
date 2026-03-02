export default function ProgressBar({ progress, level, total }) {
    return (
        <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
            <span className="progress-label">Level {level}/{total}</span>
        </div>
    )
}
