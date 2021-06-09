function ppv = getPPV(SEG, GT)  
    % SEG, GT are the binary segmentation and ground truth areas, respectively.  
    % sensitivity  
    ppv = double(sum(uint8(SEG(:) & GT(:)))) / double(sum(uint8(GT(:))));  
end 
