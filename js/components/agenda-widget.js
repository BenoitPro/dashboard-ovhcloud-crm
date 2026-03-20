// Weekly Schedule Widget — full width calendar grid
// Phase 2: data from Dynamics 365 activitypointers API

const ACTIVITY_ICONS = { call: '📞', meeting: '📅', task: '✅' };

// Module-level state for navigation between weeks
let currentWeekOffset = 0;

export function renderAgendaWidget(container, activities, onCreateActivity) {

  // Inner render function to update widget state without destroying container
  function render() {
    const curr = new Date();
    // apply week offset
    curr.setDate(curr.getDate() + (currentWeekOffset * 7));

    // Find the Monday of the current week (relative to curr)
    const dayOfWeek = curr.getDay(); // 0 is Sunday
    const distanceToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const first = curr.getDate() + distanceToMonday; 
    
    const days = [];
    for (let i = 0; i < 5; i++) {
      const d = new Date(curr.getTime());
      d.setDate(first + i);
      days.push(d);
    }
    
    const hours = [8,9,10,11,12,13,14,15,16,17,18];
    const today = new Date(); // Real today for highlighting
    
    // Headers HTML
    let headerHtml = `<div class="weekly-col-header"></div>`;
    const dayNames = ['MON','TUE','WED','THU','FRI'];
    days.forEach((d, i) => {
      // highlighted if it is today
      const isToday = d.toDateString() === today.toDateString();
      const colorStyle = isToday ? 'color: var(--color-brand); font-weight: var(--font-weight-extrabold)' : '';
      
      headerHtml += `
        <div class="weekly-col-header" style="${isToday ? 'color: var(--color-brand)' : ''}">
          ${dayNames[i]}<span class="day-num" style="${colorStyle}">${d.getDate()}</span>
        </div>
      `;
    });
    
    let gridHtml = '';
    const slots = [];
    for(let h=8; h<19; h++) {
      slots.push({h, m:0});
      if(h !== 18) slots.push({h, m:30});
    }

    // 1. Draw Grid Lines
    slots.forEach(({h, m}) => {
      const row = (h - 8) * 2 + (m === 30 ? 2 : 1);
      const hourLabel = m === 0 ? (h < 10 ? `0${h}:00` : `${h}:00`) : '';
      gridHtml += `<div class="weekly-time-label" style="grid-column: 1; grid-row: ${row}; border-bottom:${m===0 ? 'none' : '1px solid var(--color-border)'}">${hourLabel}</div>`;
      
      days.forEach((d, dayIndex) => {
        const slotStart = new Date(d);
        slotStart.setHours(h, m, 0, 0);
        const isoStart = slotStart.toISOString();
        gridHtml += `<div class="weekly-cell" style="grid-column: ${dayIndex + 2}; grid-row: ${row};" data-date="${isoStart}" data-day="${dayIndex}" data-time="${h*60+m}"></div>`;
      });
    });

    // 2. Draw Events as Grid Overlays
    activities.forEach(act => {
      const ad = new Date(act.due_date);
      // Find day column
      const dayIndex = days.findIndex(d => 
        d.getFullYear() === ad.getFullYear() && 
        d.getMonth() === ad.getMonth() && 
        d.getDate() === ad.getDate()
      );
      
      if (dayIndex >= 0) {
        const h = ad.getHours();
        const m = ad.getMinutes();
        if (h >= 8 && h < 19) {
          const startRow = (h - 8) * 2 + (m >= 30 ? 2 : 1);
          // Calculate span from dates if available, otherwise fallback to task=1, meeting/call=2
          let spanConfig = act.type === 'task' ? 1 : 2; 
          if (act.end_date) {
            const diffMins = (new Date(act.end_date).getTime() - ad.getTime()) / 60000;
            if (diffMins > 0) {
              spanConfig = Math.max(1, Math.round(diffMins / 30));
            }
          }
          
          let color = 'var(--color-brand)';
          if (act.type === 'meeting') color = 'var(--color-success)';
          if (act.type === 'task') color = 'var(--color-amber)';
          
          const icon = ACTIVITY_ICONS[act.type] || '';
          
          gridHtml += `
            <div class="weekly-event" style="
              grid-column: ${dayIndex + 2}; 
              grid-row: ${startRow} / span ${spanConfig}; 
              background: ${color};
              margin: 2px 4px;
              padding: 4px 6px;
              z-index: 10;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
              white-space: normal;
            " title="${act.subject}">
               <div style="font-weight: 600;">${icon} ${act.subject}</div>
            </div>
          `;
        }
      }
    });

    const mFormat = new Intl.DateTimeFormat('fr-FR', { month: 'short' });
    const dateRangeStr = `${days[0].getDate()} ${mFormat.format(days[0])} - ${days[4].getDate()} ${mFormat.format(days[4])}`;
    
    const isCurrentWeek = currentWeekOffset === 0;

    container.innerHTML = `
      <div class="weekly-schedule">
        <div class="weekly-header" style="flex-wrap: wrap; gap: 12px;">
          <div style="display:flex;align-items:center;gap:8px;font-size:var(--font-size-base);font-weight:var(--font-weight-bold)">
            📅 Weekly Schedule 
            
            <span style="display:flex;align-items:center;gap:4px;margin-left:16px;">
              <button id="btn-prev-week" style="background:none;border:none;cursor:pointer;color:var(--color-text-secondary);padding:4px;" title="Semaine Précédente">◀</button>
              <span style="font-weight:var(--font-weight-regular);font-size:var(--font-size-sm);color:var(--color-text-disabled);min-width:110px;text-align:center;">
                 ${dateRangeStr} ${isCurrentWeek ? '' : '(*)'}
              </span>
              <button id="btn-next-week" style="background:none;border:none;cursor:pointer;color:var(--color-text-secondary);padding:4px;" title="Semaine Suivante">▶</button>
            </span>
          </div>
          
          <div style="display:flex;align-items:center;gap:16px;">
            <div style="display:flex;gap:12px;font-size:11px;color:var(--color-text-secondary);align-items:center;">
               <span style="display:inline-flex;align-items:center;gap:4px"><span style="display:inline-block;width:8px;height:8px;border-radius:2px;background:var(--color-brand)"></span>Appel</span>
               <span style="display:inline-flex;align-items:center;gap:4px"><span style="display:inline-block;width:8px;height:8px;border-radius:2px;background:var(--color-success)"></span>RDV &amp; Appointment</span>
               <span style="display:inline-flex;align-items:center;gap:4px"><span style="display:inline-block;width:8px;height:8px;border-radius:2px;background:var(--color-amber)"></span>Tâche</span>
            </div>
            <button class="btn btn-primary btn-sm" id="btn-create-activity-agenda">+ Create activity</button>
          </div>
        </div>
        <div class="weekly-grid">${headerHtml}</div>
        <div class="weekly-body" style="user-select:none">${gridHtml}</div>
      </div>
    `;

    container.querySelector('#btn-prev-week').addEventListener('click', () => { currentWeekOffset--; render(); });
    container.querySelector('#btn-next-week').addEventListener('click', () => { currentWeekOffset++; render(); });

    // Drag selection logic (replaces buggy individual click logic)
    const cells = container.querySelectorAll('.weekly-cell');
    let isDragging = false;
    let dragStartCell = null;
    let dragEndCell = null;
    
    function highlightRange() {
      cells.forEach(c => c.classList.remove('selected'));
      if(!dragStartCell || !dragEndCell) return;
      
      const startDay = parseInt(dragStartCell.dataset.day);
      const endDay = parseInt(dragEndCell.dataset.day);
      const startTime = parseInt(dragStartCell.dataset.time);
      const endTime = parseInt(dragEndCell.dataset.time);
      
      if (startDay !== endDay) {
         dragEndCell.classList.add('selected'); 
         return;
      }
      
      const minTime = Math.min(startTime, endTime);
      const maxTime = Math.max(startTime, endTime);
      
      cells.forEach(c => {
        const d = parseInt(c.dataset.day);
        const t = parseInt(c.dataset.time);
        if (d === startDay && t >= minTime && t <= maxTime) {
          c.classList.add('selected');
        }
      });
    }

    cells.forEach(cell => {
      cell.addEventListener('mousedown', (e) => {
        if(e.target.closest('.weekly-event')) return; 
        if(e.button !== 0 && e.button !== 2) return; 
        isDragging = true;
        dragStartCell = cell;
        dragEndCell = cell;
        highlightRange();
      });
      
      cell.addEventListener('mouseenter', () => {
        if(isDragging) {
          dragEndCell = cell;
          highlightRange();
        }
      });
    });
    
    document.addEventListener('mouseup', () => {
      if(!isDragging) return;
      isDragging = false;
      
      if(dragStartCell && dragEndCell) {
        const startDay = parseInt(dragStartCell.dataset.day);
        const endDay = parseInt(dragEndCell.dataset.day);
        
        let startIso, endIso;
        if (startDay === endDay) {
          const t1 = parseInt(dragStartCell.dataset.time);
          const t2 = parseInt(dragEndCell.dataset.time);
          
          const startDate = t1 < t2 ? dragStartCell.dataset.date : dragEndCell.dataset.date;
          const endCell = t1 < t2 ? dragEndCell : dragStartCell;
          
          const endDate = new Date(new Date(endCell.dataset.date).getTime() + 30 * 60000).toISOString();
          startIso = startDate;
          endIso = endDate;
        } else {
          startIso = dragEndCell.dataset.date;
          endIso = new Date(new Date(dragEndCell.dataset.date).getTime() + 30 * 60000).toISOString();
        }
        
        cells.forEach(c => c.classList.remove('selected'));
        if (onCreateActivity) onCreateActivity(null, startIso, endIso);
      }
      
      dragStartCell = null;
      dragEndCell = null;
    }, { once: false });

    container.querySelector('.weekly-body').addEventListener('contextmenu', e => {
      e.preventDefault(); 
    });

    container.querySelector('#btn-create-activity-agenda')?.addEventListener('click', () => {
      if (onCreateActivity) onCreateActivity();
    });
  }

  // Initial render process
  render();
}
