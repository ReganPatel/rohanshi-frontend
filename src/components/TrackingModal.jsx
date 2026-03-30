import React from 'react';


const TrackingModal = ({ isOpen, onClose, item }) => {
    if (!isOpen || !item) return null;

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn'>
            <div className='glass-card rounded-[2.5rem] shadow-2xl max-w-lg w-full relative flex flex-col h-[80vh] md:h-auto md:max-h-[85vh] border border-white/10 gold-glow overflow-hidden'>

                {/* Header */}
                <div className='flex items-center justify-between px-8 py-6 border-b border-white/5'>
                    <div className='flex flex-col'>
                        <p className='text-[10px] font-outfit text-secondary uppercase tracking-[0.3em] font-bold mb-1'>TRACKING SYSTEM</p>
                        <h2 className='text-xl font-outfit font-bold text-white uppercase tracking-tighter'>Order Status</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className='text-gray-400 hover:text-white focus:outline-none p-2 hover:bg-white/5 rounded-full transition-all'
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                {/* Content Body - Scrollable */}
                <div className='px-8 py-8 overflow-y-auto flex-1 custom-scrollbar'>
                    <div className='mb-10 bg-white/5 p-4 rounded-2xl border border-white/5'>
                        <p className='text-[8px] font-outfit text-gray-500 uppercase tracking-widest mb-1'>PRODUCT NAME</p>
                        <h3 className='font-outfit font-bold text-white uppercase tracking-wider'>{item.name}</h3>
                    </div>

                    {(() => {
                        const allStatuses = [
                            { status: 'Order Placed', details: 'Your order has been placed successfully.' },
                            { status: 'Packing', details: 'Your order is being packed.' },
                            { status: 'Shipped', details: 'Your item has been shipped.' },
                            { status: 'Out for delivery', details: 'Your item is out for delivery.' },
                            { status: 'Delivered', details: 'Your item has been delivered.' }
                        ];

                        const history = item.statusHistory || [];

                        // Add return steps if return process has started
                        if (history.some(h => ['Return Requested', 'Initiated', 'Dropped off', 'Received', 'Refund Issued', 'Refund Credited', 'Return Canceled'].includes(h.status))) {
                            if (history.some(h => h.status === 'Return Requested')) {
                                allStatuses.push({ status: 'Return Requested', details: 'Return request was initiated.' });
                            }
                            if (history.some(h => h.status === 'Initiated')) {
                                allStatuses.push({ status: 'Initiated', details: 'Return request approved. Please prepare the package.' });
                            }
                            if (history.some(h => h.status === 'Dropped off')) {
                                allStatuses.push({ status: 'Dropped off', details: 'Item dropped off at collection point.' });
                            }
                            if (history.some(h => h.status === 'Received')) {
                                allStatuses.push({ status: 'Received', details: 'Item received and inspected.' });
                            }
                            if (history.some(h => h.status === 'Refund Issued')) {
                                allStatuses.push({ status: 'Refund Issued', details: 'Refund process started.' });
                            }
                            if (history.some(h => h.status === 'Refund Credited')) {
                                allStatuses.push({ status: 'Refund Credited', details: 'Refund credited to your original payment method.' });
                            }
                            if (history.some(h => h.status === 'Return Canceled')) {
                                allStatuses.push({ status: 'Return Canceled', details: 'Return request was reviewed and rejected by admin.' });
                            }
                        }

                        // Find the index of the furthest completed step in our allStatuses array
                        let furthestStepIndex = -1;
                        allStatuses.forEach((step, index) => {
                            if (history.some(h => h.status === step.status)) {
                                furthestStepIndex = index;
                            }
                        });

                        return (
                            <div className='relative'>
                                <div className='flex flex-col gap-6 relative'>
                                    {allStatuses.map((step, i) => {
                                        const historyItem = history.find(h => h.status === step.status);
                                        const isCompleted = !!historyItem;
                                        const isNextCompleted = i < allStatuses.length - 1 && history.some(h => h.status === allStatuses[i + 1].status);
                                        const isLast = (i === allStatuses.length - 1);

                                        let formattedDate = "";
                                        let time = "";
                                        if (historyItem) {
                                            const dateObj = new Date(historyItem.date);
                                            formattedDate = dateObj.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: '2-digit' });
                                            time = dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).toLowerCase();
                                        }

                                        return (
                                            <div key={i} className='flex gap-6 relative'>
                                                {/* Line segment to next dot */}
                                                {!isLast && (
                                                    <div className='absolute left-[13px] top-4 h-[calc(100%+32px)] w-[1px] bg-white/5 overflow-hidden'>
                                                        <div
                                                            className={`absolute top-0 left-0 w-full transition-all duration-700 ease-in-out
                                                                ${allStatuses[i + 1]?.status === 'Return Canceled' ? 'bg-red-500' :
                                                                    ['Return Requested', 'Returned'].includes(allStatuses[i + 1]?.status) ? 'bg-orange-500' : 'bg-secondary shadow-[0_0_10px_rgba(212,175,55,0.4)]'}`}
                                                            style={{ height: isNextCompleted ? '100%' : '0%' }}
                                                        ></div>
                                                    </div>
                                                )}

                                                {/* Dot */}
                                                <div className='relative z-10'>
                                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center border-4 border-black transition-all duration-700
                                                        ${isCompleted ? (
                                                            step.status === 'Return Canceled' ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' :
                                                                ['Return Requested', 'Returned'].includes(step.status) ? 'bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)]' :
                                                                    'bg-secondary shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                                                        ) : 'bg-white/10'}`}
                                                    >
                                                        {isCompleted && (
                                                            <svg className="w-3.5 h-3.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path>
                                                            </svg>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Text Content */}
                                                <div className={`flex-1 pb-10 transition-all duration-700 ${isCompleted ? 'opacity-100 translate-x-0' : 'opacity-20 -translate-x-2'}`}>
                                                    <div className='flex md:items-center justify-between gap-1 md:gap-2 mb-2'>
                                                        <span className={`font-outfit font-bold text-base uppercase tracking-wider ${isCompleted ? 'gold-text' : 'text-gray-400'}`}>{step.status === 'Return Canceled' ? 'Return Rejected' : step.status}</span>
                                                        {historyItem && <span className='text-[10px] font-outfit font-bold text-gray-500 uppercase tracking-widest'>{formattedDate}</span>}
                                                    </div>
                                                    <p className='text-gray-400 text-xs font-outfit leading-relaxed uppercase tracking-widest opacity-80'>{historyItem ? historyItem.details : step.details}</p>
                                                    {historyItem && <p className='text-[9px] font-outfit text-secondary font-bold mt-2 uppercase tracking-[0.2em]'>{time}</p>}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        );
                    })()}
                </div>

                {/* Footer */}
                <div className='px-8 py-6 border-t border-white/5 bg-white/5 flex justify-end shrink-0'>
                    <button
                        onClick={onClose}
                        className='px-10 py-3 rounded-xl bg-white text-black text-[10px] font-outfit font-bold uppercase tracking-[0.3em] hover:bg-secondary transition-all shadow-lg'
                    >
                        Dismiss
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TrackingModal;
